#!/usr/bin/env python
# coding: utf-8

import scrapy

from scrapy.spiders import CrawlSpider

class NccmnHistory(scrapy.Spider):
    name = "nccmnhistory"
    allowed_domains = ["google.com"]
    start_urls = ["https://sites.google.com/site/nccmnhistory/the-50-key-dates-of-world-history"]

    # Returns a dictionary with URL and title
    def parse(self, response):
        for response in response.css(".sites-layout-tile > div:nth-child(1) > span:nth-child(1) > div:nth-child(2) > div:nth-child(3) > p"):
            # Skip invalid cases with either no year or description
            try: year_info, text = response.css("b::text").get().split()[1:], response.css("p::text").get().strip()
            except: continue

            # Handle cases with 1 and 2 list items seperately
            if len(year_info) == 2:
                # Test whether AD or BC
                if "AD" in year_info[0] or "AD" in year_info[1]:
                    year_info[0], year_info[1] = year_info[0].replace("AD", ""), year_info[1].replace("AD", "")
                    ad = True
                elif "BC" in year_info[0] or "BC" in year_info[1]:
                    year_info[0], year_info[1] = year_info[0].replace("BC", ""), year_info[1].replace("BC", "")
                    ad = False

                # Test for circa (approximate date)
                if "c." in year_info[0] or "c." in year_info[1]:
                    year_info[0], year_info[1] = year_info[0].replace("c.", ""), year_info[1].replace("c.", "")
                    circa = True

                year = year_info[0] if year_info[0] != "" else year_info[1]
                year = int(year.split("-")[0])
                if ad == False: year = -year
            else: year, circa = year_info[0], False

            for event in text.split(";"):
                event = event.split(":")[0].strip()
                event = event[0].upper() + event[1:]
                if event[-1] != ".": event = event + "."
                yield {"year": year, "circa": circa, "description": event}
