import Json from '../_json'

test('it dumps and loads', () => {
  const value = { a: 'b', c: 123, d: true, e: [4, 5, 6] }
  expect(Json.loads(Json.dumps(value))).toEqual(value)
})
