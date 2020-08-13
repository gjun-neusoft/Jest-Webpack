const {fetchData, fetchDataAsync, fetchDataPromise, fetchDataAxios} = require('../src/js/index');
import axios from 'axios'
import "babel-polyfill";
import regeneratorRuntime from '../src/libs/runtime'
// const axios = require('axios')
jest.mock('axios')// 让 jest 对 axios 做一个模拟
describe('JEST测试', () => {
    it('方法测试', () => {
        expect(fetchData(3, 4)).toBe(7)
    })
    it('异步测试', (done) => {
        function callback(data){
            expect(data).toBe(6)
            done()
        }
        fetchDataAsync(callback)
    })
    it('Promise测试', () => {
        expect.assertions(1);//指定断言次数，大于或小于会报错。
        return fetchDataPromise().then(res => {
            expect(res).toBe(JSON.stringify({name:"g.jun"}))
        })
    })
    it('Promise失败测试', () => {
        expect.assertions(1);
        // return expect(fetchDataPromise(false)).rejects.toMatch('err')
        return fetchDataPromise(false).catch(e => expect(e).toMatch('error'));
    })
    
    it('接口测试', async() => {
        // 改变函数的内部实现，让它同步的模拟数据
        axios.get.mockResolvedValueOnce( {data: 'Hello Neusoft.com'} )
        await fetchDataAxios().then(res => {
            expect(res).toBe('Hello Neusoft.com')
        })
    })
})

