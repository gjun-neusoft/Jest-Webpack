import TestClass from '../src/js/Test'

let Test
beforeAll(() => {
    Test = new TestClass()
})
describe('Jest 类测试', () => {
    it('获取username', () => {
        expect(Test.getUserName()).toBe('g.jun')
    })
    it('获取company', () => {
        expect(Test.getCompany()).toBe('Neusoft')
    })
    it('获取group', () => {
        expect(Test.getGroup()).toBe('NeuView')
    })
})