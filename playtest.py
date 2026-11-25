"""Play-test KOPITIAM RUSH headlessly: start Night 1, cook the first order
in recipe order, serve it, and screenshot the result."""
import os, subprocess, sys, time
from playwright.sync_api import sync_playwright

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
        page.goto("http://localhost:8080/index.html", wait_until="networkidle")
        page.wait_for_timeout(800)
        page.mouse.click(640, 502)  # START NIGHT 1
        page.wait_for_timeout(800)
        page.mouse.click(150, 150)  # select first order
        page.wait_for_timeout(300)
        # First order is seeded: Nasi Lemak = rice(1) egg(3) sambal(6) veg(7) chicken(4).
        # Press keys in recipe order; a wrong key would break the combo, not the plate.
        for key in ["3", "8", "7"]:
            page.keyboard.press(key)
            page.wait_for_timeout(200)
        page.keyboard.press("s")  # serve
        page.wait_for_timeout(600)
        page.screenshot(path="/tmp/playtest-served2.jpg", type="jpeg", quality=85)
        print("playtest screenshot saved")
        browser.close()
finally:
    server.terminate()
print("ERRORS:\n" + "\n".join(errors) if errors else "no console/page errors")
