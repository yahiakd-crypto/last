# Local lightweight shim for `crawl4ai`, installed by the Punchline AD LIBRARY
# "light" setup. The upstream facebook_ads_mcp_complete.py imports
# `from crawl4ai import WebCrawler` at module load, but crawl4ai (+ Playwright
# Chromium) is intentionally NOT installed here to keep the environment light.
#
# Instead of fabricating creative analysis, every crawl attempt raises, which
# the MCP script catches and surfaces as an honest "unavailable from current
# data source" result. No data is ever invented.
class WebCrawler:
    def __init__(self, *args, **kwargs):
        pass

    def run(self, url=None, **kwargs):
        raise RuntimeError(
            "crawl4ai is not installed in this environment (AD LIBRARY light setup). "
            "Ad snapshot creative crawling is unavailable from the current data source."
        )
