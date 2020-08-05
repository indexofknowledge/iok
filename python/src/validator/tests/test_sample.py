from ..validate import run_validator
import os

SAMPLE_FILE_PATH = os.path.dirname(os.path.abspath(__file__)) + "/../sample.json"


def test_sample():
    """Just validate the sample graph for sanity"""
    print(os.getcwd())
    run_validator(SAMPLE_FILE_PATH)
