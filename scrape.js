const express = require("express");
const cors= require("cors")
const app = express()
const axios=require('axios')
const cheerio = require('cheerio')
const port=7000

app.use(cors())
app.use(express.json())

app.post('/searchitem',async (req,res)=>{
    let reqData = req.body.searched_item
    const result = [];

    // // Amazon data
    try {
        let amazon = await axios.get(`https://www.amazon.in/s?k=${reqData}`)
        const amazonHtml = amazon.data 
        const $ = cheerio.load(amazonHtml);
        $('.s-result-item').each((i, el) => {
            if (i >= 40) return false;
            const productImg = $(el).find('.s-image').first().attr('src');
            const productTitle = $(el).find('.a-size-base-plus.a-color-base.a-text-normal').first().text();
            const discountedprice=$(el).find('.a-price-whole').text();
            const price=$(el).find('.a-offscreen').text();
            const rating=$(el).find('.a-icon-alt').text();
    
            result.push({ productImg, productTitle ,discountedprice,rating,price});
            console.log('resss',result)
        });
    } catch (error) {
        console.log('err1',error)
    }




//     // Flipkart
// // Flipkart
    let res2 = []
    try {
        let flipkart = await axios.get(`https://www.flipkart.com/search?q=${reqData}`)
        const flipkartData = flipkart.data
        const $$ =cheerio.load(flipkartData);
        const productClass=$$("._2r_T1I")
        const proTit = $$("._2B099V a")
        for(let j=0;j<10;j++){
           const p1 = productClass[j].attribs.src
            const p2 =proTit[j].attribs.title
            res2.push({p1,p2})
        }

    } catch (error) {
        console.log('err2',error)
    }


    let res3=[]
    try {
        let snapdeal=await axios.get(`https://www.snapdeal.com/search?keyword=${reqData}`)
        const snapData=snapdeal.data
        const $$$=cheerio.load(snapData)
        const snapImg=$$$(".product-image")
        const snaptitle=$$$(".product-title")
        // const mrp = $$$(".product-price").eq(0).text().trim();
        for(let k=0;k<10;k++){
            let s1=snapImg[k].attribs.srcset
            let s2=snaptitle[k].attribs.title
            
             res3.push({s1,s2})
        } 
    } catch (error) {
        console.log('err3',error)
    }
    try {
        let finalres = [...result,...res2,...res3]

        res.send(finalres)
    } catch (error) {
        console.log('err3',error)
        res.send("Errorr")
    }

})

app.listen(port,() =>{
    console.log("app started",port)
})
