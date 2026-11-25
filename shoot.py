"""Render the four staged ?shot= states of KOPITIAM RUSH with Playwright
+ Chromium 1255 and save them as JPEG screenshots. Run from repo root."""
import json, os, subprocess, sys, time
from playwright.sync_api import sync_playwright

shots = json.load(open("shots.json"))
os.makedirs("screenshots", exist_ok=True)
server = subprocess.Popen(
    [sys.executable, "-m", "http.server", "8080", "--directory", "game"],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
errors = []
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=os.path.expanduser(
                "~/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome"),
            args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1280, "height": 800})
        page.on("console", lambda m: errors.append("console: " + m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append("pageerror: " + str(e)))
        for shot in shots:
            page.goto("http://localhost:8080/index.html" + shot["query"], wait_until="networkidle")
            page.wait_for_timeout(1200)
            page.screenshot(path="screenshots/" + shot["name"], type="jpeg", quality=85)
            print("shot", shot["name"], "done")
        browser.close()
finally:
    server.terminate()
if errors:
    print("ERRORS:\n" + "\n".join(errors))
    sys.exit(1)
print("no console/page errors")
