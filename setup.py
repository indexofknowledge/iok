from setuptools import setup, find_packages

setup(
    name="index-of-knowledge",
    version="0.1.0",
    description="IoK python utils",
    python_requires=">=3.5",
    packages=find_packages("src"),
    tests_require=["pytest", "pytest-runner"],
    package_dir={"": "src/"},
    setup_requires=["pytest-runner"],
)