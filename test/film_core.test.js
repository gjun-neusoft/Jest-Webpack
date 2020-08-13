import FilmCore from '../src/js/film_core'
import 'jest-extended';
import axios from 'axios'
import regeneratorRuntime from '../src/libs/runtime'
let Film
beforeAll(() => {
    Film = new FilmCore()
})
describe('FilmCore组件测试', () => {
    it('addFilm方法测试', () => {
        expect(Film.addFilm()).toBeObject()
    })
    it('setActiveFilm方法测试', () => {
        expect.assertions(1)
        return Film.setActiveFilm(1).then(res=>{
            expect(res).toBeObject()
        }).catch(err=>{
            expect(err).toBeString()
        })
        
    })
    it('getActiveFilm方法测试', () => {
        expect(Film.getActiveFilm()).toBeBoolean()
    })
    it('getActiveFilmIndex方法测试', () => {
        let activeFilm = Film.getActiveFilm()
        if(activeFilm){
            expect(Film.getActiveFilmIndex()).toBeObject()
        }else{
            expect(Film.getActiveFilmIndex()).toBeBoolean()
        }
    })
    it('getFilm方法测试', () => {
        let film = Film.data[1]
        if(film){
            expect(Film.getFilm()).toBeObject()
        }else{
            expect(Film.getFilm()).toBeBoolean()
        }
    })
    it('getFilmIndex方法测试', () => {
        if(Film.getFilmIndex(Film.data) > 0){
            expect(Film.getFilmIndex(Film.data)).toBeObject()
        }else{
            expect(Film.getFilmIndex(Film.data)).toBe(-1)
        }
    })
    it('addFilmItem方法测试', () => {
        let film = Film.data[1]
        if(film){
            expect(Film.addFilmItem('1')).toBeObject()
        }else{
            expect(Film.addFilmItem('1')).toBe(false)
        }
    })
//这个方法里有一个ajax请求，需要把请求单独拿出来做接口测试
    it('requestData方法测试', () => {
        expect.assertions(1)
        return Film.requestData().then(res => {
            expect(res).toBeObject()
        }).catch(err => {
            expect(err).toBeObject()
        })
    })
    it('filterScaleData方法测试', () => {
        expect(Film.filterScaleData(Film.data)).toBeArray()
    })

})

