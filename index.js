const pupperter=require('puppeteer');
const chalk= require('chalk')
const fs = require('fs')
const err_color=chalk.bold.red;
const success_color=chalk.keyword('green');


async function scrap_hn(){
    try{
        var browser= await pupperter.launch({headless:true});

        var page=await browser.newPage();
        await page.goto('https://news.ycombinator.com/');
        await page.waitForSelector('a.storylink')

        var news_list=await page.evaluate(()=>{
            var titleList= document.querySelectorAll(`a.storylink`);
            var ageList= document.querySelectorAll(`span.age`);
            var scoreList= document.querySelectorAll(`span.score`);
            var LinkArray=[];
            for (let index = 0; index < titleList.length; index++) {
                LinkArray[index]={
                    title:titleList[index].innerText.trim(),
                    link:titleList[index].getAttribute('href'),
                    age:ageList[index].innerText.trim(),
                    score:scoreList[index].innerText.trim()
                }
            }
            return LinkArray
        })
        await browser.close()
        fs.writeFile('news_list.json', JSON.stringify(news_list, null, 2), (err)=>{
            if(err)console.log(err_color(err))
            console.log(success_color("saved"))
        })
    }catch(err){
        console.log(err_color(err))
        await browser.close();
        console.log(err_color("browser closed"))
    }
}

scrap_hn()