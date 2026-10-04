"""Append one day of GoatCounter numbers to analytics/daily.csv.

    python analytics/goatcounter_daily.py              # yesterday, Cairo time
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
HEADER = ["date", "unique_visitors", "app_downloads", "sample_downloads", "downloads_by_build"]


def get(path: str) -> dict:
    req = urllib.request.Request(API + path, headers={"Content-Type": "application/json", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def utc(d: date) -> str:
    return datetime.combine(d, time(), CAIRO).astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def day_row(d: date) -> list:
    span = f"start={utc(d)}&end={utc(d + timedelta(days=1))}"
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
    return [d.isoformat(), visitors, sum(builds.values()), sample, by_build]


def main() -> None:
    d = date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else datetime.now(CAIRO).date() - timedelta(days=1)
    rows = list(csv.reader(OUT.open(encoding="utf-8")))[1:] if OUT.exists() else []
    rows = [r for r in rows if r and r[0] != d.isoformat()] + [day_row(d)]
    rows.sort(key=lambda r: r[0])
    with OUT.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(HEADER)
        w.writerows(rows)
    print(",".join(map(str, next(r for r in rows if r[0] == d.isoformat()))))


if __name__ == "__main__":
    main()
