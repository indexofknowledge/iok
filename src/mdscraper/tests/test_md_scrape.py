# pyre-strict

from ..md_scrape import cmp_hierarchy, Scope


def test_cmp_hierarchy():
    s1, s2 = r"^[A-Za-z]", r"^###"
    ret = cmp_hierarchy(s1, s2)
    assert ret < 0

    s1, s2 = r"^###", r"^###"
    ret = cmp_hierarchy(s1, s2)
    assert ret == 0

    s1, s2 = r"^badcmp", r"^###"
    try:
        cmp_hierarchy(s1, s2)
    except AssertionError:
        pass


def test_scope():
    scope = Scope(r"^###", "### Bitcoin")
    assert scope.get_name() == "Bitcoin"

    test_text = "Script - Bitcoin Wiki"
    test_link = "https://en.bitcoin.it/wiki/Script"
    scope = Scope(r"^[*-]", f"* [{test_text}]({test_link})")
    print(scope.node)
    assert scope.node["data"]["data"]["text"] == test_text
    assert scope.node["data"]["data"]["link"] == test_link
