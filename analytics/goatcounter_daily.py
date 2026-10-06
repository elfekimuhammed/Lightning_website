"""Keep analytics/daily.csv up to date from GoatCounter: one row per Cairo day.

    python analytics/goatcounter_daily.py              # refresh the last four Cairo days
    python analytics/goatcounter_daily.py 2026-10-03   # refresh one specific day

The GitHub Actions workflow provides GOATCOUNTER_API_KEY. Existing dates are
replaced, so reruns are safe.
"""
import csv
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

API = "https://mohamedelfeki.goatcounter.com/api/v0"
CAIRO = ZoneInfo("Africa/Cairo")
OUT = Path(__file__).with_name("daily.csv")
HEADER = [
    "date",
    "unique_visitors",
    "page_visits",
    "app_downloads",
    "sample_downloads",
    "downloads_by_build",
    "updated_at",
]


def get(path: str) -> dict:
    token = os.environ.get("GOATCOUNTER_API_KEY", "").strip()
    if not token:
        raise RuntimeError("GOATCOUNTER_API_KEY is not set")
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {token}",
    }
    req = urllib.request.Request(API + path, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"GoatCounter {e.code} for {path}: {body}") from e


def utc(moment: datetime) -> str:
    return moment.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def day_row(d: date) -> list:
    start = datetime.combine(d, time(), CAIRO)
    end = min(
        start + timedelta(days=1),
        datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0),
    )
    span = f"start={utc(start)}&end={utc(end)}"

    total = get(f"/stats/total?{span}")
    visitors = max(0, int(total.get("total", 0)) - int(total.get("total_events", 0)))

    builds = {}
    sample = 0
    page_visits = 0
    excluded = []

    while True:
        params = span + "&limit=100"
        if excluded:
            params += "&" + urllib.parse.urlencode(
                [("exclude_paths", str(path_id)) for path_id in excluded]
            )
        page = get(f"/stats/hits?{params}")
        hits = page.get("hits", [])

        for hit in hits:
            path = hit.get("path", "")
            count = int(hit.get("count", 0))
            is_event = bool(hit.get("event", False))

            if not is_event:
                page_visits += count
            elif path.startswith("download-app-"):
                builds[path.removeprefix("download-app-")] = count
            elif path.startswith("download-sample-"):
                sample += count

        if not page.get("more") or not hits:
            break
        excluded.extend(hit["path_id"] for hit in hits)

    by_build = "; ".join(f"{k}: {v}" for k, v in sorted(builds.items()))
    stamp = datetime.now(CAIRO).strftime("%Y-%m-%d %H:%M")
    return [
        d.isoformat(),
        visitors,
        page_visits,
        sum(builds.values()),
        sample,
        by_build,
        stamp,
    ]


def main() -> None:
    today = datetime.now(CAIRO).date()
    if len(sys.argv) > 1:
        days = [date.fromisoformat(sys.argv[1])]
    else:
        days = [today - timedelta(days=n) for n in range(3, -1, -1)]

    new = [day_row(d) for d in days]
    keep = {d.isoformat() for d in days}

    rows = []
    if OUT.exists():
        existing = list(csv.reader(OUT.open(encoding="utf-8")))
        rows = existing[1:] if existing else []

    # Keep untouched older rows. Current deployment starts with only the rolling
    # four-day window, so all existing rows are migrated to the new schema now.
    rows = [r for r in rows if r and r[0] not in keep] + new
    rows.sort(key=lambda r: r[0])

    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(HEADER)
        w.writerows(rows)

    for r in new:
        print(",".join(map(str, r)))


if __name__ == "__main__":
    main()
