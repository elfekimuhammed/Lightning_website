"""Keep analytics/daily.csv up to date from GoatCounter: one row per Cairo day.

    python analytics/goatcounter_daily.py              # yesterday (final) and today (so far)
    python analytics/goatcounter_daily.py 2026-10-03   # a given day

Reads https://mohamedelfeki.goatcounter.com/api/v0 (the API key is added to the
request by the environment's GoatCounter credential). A day already in the file
is replaced, so running twice is safe. The Google Sheet "Lightning site analytics"
reads daily.csv with IMPORTDATA.
"""
import csv
import json
import sys
import urllib.request
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

API = "https://mohamedelfeki.goatcounter.com/api/v0"
CAIRO = ZoneInfo("Africa/Cairo")
OUT = Path(__file__).with_name("daily.csv")
HEADER = ["date", "unique_visitors", "app_downloads", "sample_downloads", "downloads_by_build", "updated_at"]


def get(path: str) -> dict:
    req = urllib.request.Request(API + path, headers={"Content-Type": "application/json", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def utc(moment: datetime) -> str:
    return moment.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def day_row(d: date) -> list:
    start = datetime.combine(d, time(), CAIRO)
    end = min(start + timedelta(days=1), datetime.now(timezone.utc).replace(minute=0, second=0, microsecond=0))
    span = f"start={utc(start)}&end={utc(end)}"
    visitors = get(f"/stats/total?{span}").get("total", 0)
    builds, sample = {}, 0
    after = ""
    while True:
        page = get(f"/stats/hits?{span}&limit=100{after}")
        for hit in page.get("hits", []):
            path, count = hit.get("path", ""), hit.get("count", 0)
            if path.startswith("download-app-"):
                builds[path.removeprefix("download-app-")] = count
            elif path.startswith("download-sample-"):
                sample += count
        if not page.get("more") or not page.get("hits"):
            break
        after = f"&exclude_paths={','.join(str(h['path_id']) for h in page['hits'])}"
    by_build = "; ".join(f"{k}: {v}" for k, v in sorted(builds.items()))
    stamp = datetime.now(CAIRO).strftime("%Y-%m-%d %H:%M")
    return [d.isoformat(), visitors, sum(builds.values()), sample, by_build, stamp]


def main() -> None:
    today = datetime.now(CAIRO).date()
    days = [date.fromisoformat(sys.argv[1])] if len(sys.argv) > 1 else [today - timedelta(days=1), today]
    new = [day_row(d) for d in days]
    keep = {d.isoformat() for d in days}
    rows = list(csv.reader(OUT.open(encoding="utf-8")))[1:] if OUT.exists() else []
    rows = [(r + [""] * len(HEADER))[:len(HEADER)] for r in rows if r and r[0] not in keep] + new
    rows.sort(key=lambda r: r[0])
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(HEADER)
        w.writerows(rows)
    for r in new:
        print(",".join(map(str, r)))


if __name__ == "__main__":
    main()
