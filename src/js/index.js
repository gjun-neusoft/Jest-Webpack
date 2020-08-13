import axios from 'axios'

const fetchData = (a,b)=>{
    return a+b
}
//异步
const fetchDataAsync = (callback) => {
    let a = 0
    let timer = setInterval(() => {
        a++
        if(a > 5){
            clearInterval(timer)
            callback(a)
        }
    },500)
}
//Promise
const fetchDataPromise = (state=true) => {
    return new Promise((resolve, rejects) => {
            if(state){
                resolve(JSON.stringify({name:'g.jun'}))
            }else{
                rejects('error404')
            }
    })
}
//接口
const fetchDataAxios = () => {
    return axios.get('/test').then(res => res.data)
}


module.exports = {fetchData, fetchDataAsync, fetchDataPromise, fetchDataAxios}