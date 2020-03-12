const pupperter=require('puppeteer');
const chalk= require('chalk')
const fs = require('fs')
const err_color=chalk.bold.red;
const success_color=chalk.keyword('green');


async function github_scrapping(){
    try{
        var browser= await pupperter.launch({headless:true});

        var page=await browser.newPage();
        await page.goto('https://github.com/nodemailer/mailparser');
        await page.waitForSelector('li.commits')

        var commit=await page.evaluate(async ()=>{
             var commit_link=document.querySelector('.commits > a')
             var new_link= commit_link.getAttribute('href')
             return 'https://github.com'+new_link
        })
            await page.goto(commit);
            await page.waitForSelector('a.message')

        var get_commits=await page.evaluate(async()=>{
                var commit_msg= document.querySelectorAll(`p.commit-title > a`);
                var commit_user= document.querySelectorAll(`a.commit-author`);
                var CommitArray=[];
                for (let index = 0; index < commit_msg.length; index++) {
                    CommitArray[index]={
                        commit_message:commit_msg[index].getAttribute('aria-label'),
                        link:'https://github.com'+commit_msg[index].getAttribute('href'),
                         user:commit_user[index].innerText.trim(),
                    }
                }
                return CommitArray
        })
        
        await browser.close()
        fs.writeFile('commit_list.json', JSON.stringify(get_commits, null, 2), (err)=>{
            if(err)console.log(err_color(err))
            console.log(success_color("saved"))
        })
    }catch(err){
        console.log(err_color(err))
        await browser.close();
        console.log(err_color("browser closed"))
    }
}

github_scrapping()