from scrapy.crawler import CrawlerProcess
from nccmn_spider import NccmnHistory

process = CrawlerProcess(settings={
    "FEEDS": {"Data.csv": {"format": "csv"}},
    "LOG_LEVEL": "WARNING"
    })

process.crawl(NccmnHistory)
process.start()
