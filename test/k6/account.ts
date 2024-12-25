/* eslint-disable @typescript-eslint/no-unused-vars */
import http from 'k6/http';
import { sleep, open, check } from 'k6';
//import { SharedArray } from 'k6/data';

export const options = {
  // vus: 1,
  // duration: '30s',
  //load test
  stages:[ 
    {duration:'5s', target:'200'},
    {duration:'2m', target:'200'},
    {duration:'5s', target:'0'}
  ],
  //stress test
  // stages:[ 
  //   {duration:'1m', target:'200'}, //ramp up
  //   {duration:'5m', target:'200'}, //stable
  //   {duration:'1m', target:'400'},//ramp up
  //   {duration:'5m', target:'400'},//stable
  //   {duration:'1m', target:'800'},//ramp up
  //   {duration:'5m', target:'800'},//stable
  //   {duration:'1m', target:'0'}
  // ],
  //spike test
  // stages:[ 
  //   {duration:'30s', target:'2000'}, //ramp up
  //   {duration:'5m', target:'2000'}, //stable
  //   {duration:'30s', target:'0'}
  // ],
  //soak test
  // stages:[ 
  //   {duration:'2m', target:'200'}, //ramp up
  //   {duration:'8h', target:'200'}, //stable
  //   {duration:'2m', target:'0'}
  // ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(95)<100'], // 95% of requests should be below 100ms
  },
};
// const slugs = new SharedArray('slugs', function () {
//   return JSON.parse(open('slugs.json'));
// });
function getToken() {
  const loginRes = http.post('http://localhost:3000/api/auth/signin', {
    email: 'saman.k@gmail.com',
    password: '123456',
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
  });

  const token = loginRes.json('access_token');
  return token;
}
export function setup() {
  const token = getToken();
  return { token };
}
export default function (data) {
  //const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];
  const headers = {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  };
  http.get('http://localhost:3000/api/account/cm4sbbl0g0000veckjmf2nyw8', headers);
  //http.get(`http://localhost:3000/api/account/${randomSlug}`);
  sleep(1);
}