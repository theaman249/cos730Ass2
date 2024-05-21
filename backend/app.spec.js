const { describe } = require('node:test')
const app = require('./app')
const request = require('supertest')
const client = request('./conn')

it('should return COS730 Backend is running',  async () => {
    const response = await request(app).get('/'); //I want to make this request a get request to the endpoint ('/')

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('COS730 Backend is running');
});

describe('GET /getUserData', () => {
    it('responds with a JSON object containing user data', async () => {
        const res = await request(app)
            .get('/getUserData')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('fname');
        expect(res.body.data).toHaveProperty('lname');
        expect(res.body.data).toHaveProperty('email');
        expect(res.body.data).toHaveProperty('company');
        expect(res.body.data).toHaveProperty('portfolio');
        expect(res.body.data).toHaveProperty('role');
        
    });
});

describe('POST /getMomentumETFs', () =>{

    it('responds with momentum etf data', async () => {

        const requestBody = {
            result_count: 2 // You can adjust this value as needed
        };
        
        const res = await request(app)
            .post('/getMomentumETFs')
            .send(requestBody)
            .expect(200);

        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array

        res.body.data.forEach(etf => {
            expect(etf).toHaveProperty('ticker');
            expect(etf).toHaveProperty('issuer');
            expect(etf).toHaveProperty('name');
            expect(etf).toHaveProperty('risk');
            expect(etf).toHaveProperty('volume');
            expect(etf).toHaveProperty('ytd_return');
        });
    });
})

describe('POST /getESGData', (req, res) =>{
    it('responds with all ESGData', async () =>{
        const requestBody = {
            result_count: 2 ,
            alphabetical: false,
            ticker: "",
            agencies: [],
            rating: "all"
        };
        
        const res = await request(app)
            .post('/getESGData')
            .send(requestBody)
            .expect(200);
    
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array
    
        res.body.data.forEach(etf => {
            expect(etf).toHaveProperty('ticker');
            expect(etf).toHaveProperty('name');
            expect(etf).toHaveProperty('rating');
        });
    })

    it('responds with one esg data point', async () =>{
        const requestBody = {
            result_count: 2 ,
            alphabetical: false,
            ticker: "NVDA",
            agencies: [],
            rating: "all"
        };
        
        const res = await request(app)
            .post('/getESGData')
            .send(requestBody)
            .expect(200);
    
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array
    
        if (res.body.data.length === 1) {
            expect(res.body.data[0]).toBeDefined();
            expect(res.body.data[0].ticker).toBe("NVDA");
        } else {
            expect(res.body.data.length).toBe(0);
        }
    })
});

describe('POST /getSentimentData', (req, res) =>{
    it('responds with all sentiment data', async () =>{
        const requestBody = {
            result_count: 2 ,
            alphabetical: true,
            ticker: "",
            sentiments: [],
        };
        
        const res = await request(app)
            .post('/getSentimentData')
            .send(requestBody)
            .expect(200);
    
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array
    
        res.body.data.forEach(etf => {
            expect(etf).toHaveProperty('ticker');
            expect(etf).toHaveProperty('name');
            expect(etf).toHaveProperty('sentiment');
        });
    })

    it('should respond with only one sentiment data point ', async() =>{
        const requestBody = {
            result_count: 2 ,
            alphabetical: true,
            ticker: "AAPL",
            sentiments: [],
        };
        
        const res = await request(app)
            .post('/getSentimentData')
            .send(requestBody)
            .expect(200);
        
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array
    
    
        if (res.body.data.length === 1) {
            expect(res.body.data[0]).toBeDefined();
            expect(res.body.data[0].ticker).toBe("AAPL");
        } else {
            expect(res.body.data.length).toBe(0);
        }
    })
});

describe('POS /getETFData', (req,res) =>{

    it('responds with all etf data', async() =>{
        const requestBody = {
            resultCount: 2 ,
            alphabetical: false,
            ticker: "",
            min_volume: 100000,
            risk: "high"
        };
        
        const res = await request(app)
            .post('/getETFData')
            .send(requestBody)
            .expect(200);
    
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array
    
        res.body.data.forEach(etf => {
            expect(etf).toHaveProperty('ticker');
            expect(etf).toHaveProperty('issuer');
            expect(etf).toHaveProperty('name');
            expect(etf).toHaveProperty('risk');
            expect(etf).toHaveProperty('volume');
            expect(etf).toHaveProperty('ytd_return');
        });
    })

    it('responds with all one etf data point', async() =>{
        const requestBody = {
            resultCount: 2 ,
            alphabetical: false,
            ticker: "SPY",
            min_volume: 100000,
            risk: "high"
        };
        
        const res = await request(app)
            .post('/getETFData')
            .send(requestBody)
            .expect(200);
    
        expect(res.body.data).toBeDefined();
        expect(Array.isArray(res.body.data)).toBe(true); // Check if the data is an array
    
        if (res.body.data.length === 1) {
            expect(res.body.data[0]).toBeDefined();
            expect(res.body.data[0].ticker).toBe("AAPL");
        } else {
            expect(res.body.data.length).toBe(0);
        }
    })
});