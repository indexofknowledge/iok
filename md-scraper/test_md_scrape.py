import unittest
from md_scrape import cmp_hierarchy, Scope


class TestMDScrape(unittest.TestCase):

    def test_cmp_hierarchy(self):
        s1, s2 = r"^[A-Za-z]", r"^###"
        ret = cmp_hierarchy(s1, s2)
        self.assertTrue(ret < 0)

        s1, s2 = r"^###", r"^###"
        ret = cmp_hierarchy(s1, s2)
        self.assertTrue(ret == 0)

        s1, s2 = r"^badcmp", r"^###"
        try:
            cmp_hierarchy(s1, s2)
        except AssertionError:
            pass

    def test_scope(self):
        scope = Scope(r"^###", "### Bitcoin")
        self.assertEquals(scope.get_name(), "Bitcoin")

        test_text = "Script - Bitcoin Wiki"
        test_link = "https://en.bitcoin.it/wiki/Script"
        scope = Scope(r"^[*-]", f"* [{test_text}]({test_link})")
        self.assertEqual(scope.node["data"]["text"], test_text)
        self.assertEqual(scope.node["data"]["link"], test_link)




if __name__ == '__main__':
    unittest.main()
