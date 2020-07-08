import requests
import json
import os, sys

from _pytest.monkeypatch import MonkeyPatch
from ..scrape import run_scraper
from .test_data import TEST_DATA


class MockRequestGet:
    def json(self):
        return TEST_DATA


def test_scape_populates_meta(monkeypatch: MonkeyPatch) -> None:

    monkeypatch.setattr(requests, "get", lambda x: MockRequestGet())
    run_scraper("fakelink", None)
