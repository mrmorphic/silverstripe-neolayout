<?php
/**
 * @package neolayout
 * @subpackage tests
 */
class NLComponentTest extends SapphireTest
{

    public function testGetLayout()
    {
        // $list = new ArrayList();
        // $list->push(new RSSFeedTest_ItemA());
        // $list->push(new RSSFeedTest_ItemB());
        // $list->push(new RSSFeedTest_ItemC());

        // $rssFeed = new RSSFeed($list, "http://www.example.com", "Test RSS Feed", "Test RSS Feed Description");
        // $content = $rssFeed->outputToBrowser();

        // $this->assertContains('<link>http://www.example.org/item-a/</link>', $content);
        // $this->assertContains('<link>http://www.example.com/item-b.html</link>', $content);
        // $this->assertContains('<link>http://www.example.com/item-c.html</link>', $content);

        // $this->assertContains('<title>ItemA</title>', $content);
        // $this->assertContains('<title>ItemB</title>', $content);
        // $this->assertContains('<title>ItemC</title>', $content);

        // $this->assertContains('<description>ItemA Content</description>', $content);
        // $this->assertContains('<description>ItemB Content</description>', $content);
        // $this->assertContains('<description>ItemC Content</description>', $content);


        // // Feed #2 - put Content() into <title> and AltContent() into <description>
        // $rssFeed = new RSSFeed($list, "http://www.example.com", "Test RSS Feed", "Test RSS Feed Description",
        // 	"Content", "AltContent");
        // $content = $rssFeed->outputToBrowser();

        // $this->assertContains('<title>ItemA Content</title>', $content);
        // $this->assertContains('<title>ItemB Content</title>', $content);
        // $this->assertContains('<title>ItemC Content</title>', $content);

        // $this->assertContains('<description>ItemA AltContent</description>', $content);
        // $this->assertContains('<description>ItemB AltContent</description>', $content);
        // $this->assertContains('<description>ItemC AltContent</description>', $content);
    }

    public function testRSSFeedWithShortcode()
    {
        // $list = new ArrayList();
        // $list->push(new RSSFeedTest_ItemD());

        // $rssFeed = new RSSFeed($list, "http://www.example.com", "Test RSS Feed", "Test RSS Feed Description");
        // $content = $rssFeed->outputToBrowser();

        // $this->assertContains('<link>http://www.example.org/item-d.html</link>', $content);

        // $this->assertContains('<title>ItemD</title>', $content);

        // $this->assertContains(
        // 	'<description>&lt;p&gt;ItemD Content test shortcode output&lt;/p&gt;</description>',
        // 	$content
        // );
    }

    public function testRenderWithTemplate()
    {
        // $rssFeed = new RSSFeed(new ArrayList(), "", "", "");
        // $rssFeed->setTemplate('RSSFeedTest');

        // $content = $rssFeed->outputToBrowser();
        // $this->assertContains('<title>Test Custom Template</title>', $content);

        // $rssFeed->setTemplate('RSSFeed');
        // $content = $rssFeed->outputToBrowser();
        // $this->assertNotContains('<title>Test Custom Template</title>', $content);
    }

    public function setUp()
    {
        // parent::setUp();
        // Config::inst()->update('Director', 'alternate_base_url', '/');
        // if(!self::$original_host) self::$original_host = $_SERVER['HTTP_HOST'];
        // $_SERVER['HTTP_HOST'] = 'www.example.org';

        // ShortcodeParser::get('default')->register('test_shortcode', function() {
        // 	return 'test shortcode output';
        // });
    }

    public function tearDown()
    {
        // parent::tearDown();
        // Config::inst()->update('Director', 'alternate_base_url', null);
        // $_SERVER['HTTP_HOST'] = self::$original_host;
    }
}
