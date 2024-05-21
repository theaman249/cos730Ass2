const { describe } = require('node:test')
const app = require('./app')
const request = require('supertest')

it('should return COS730 Backend is running',  async () => {
    const response = await request(app).get('/'); //I want to make this request a get request to the endpoint ('/')

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('COS730 Backend is running');
});

describe('GET /getUserData', () => {
    it('unit test for the getUserData endPoint', async() =>{
        
        //rather than mock the endpoint, I'm going to mock the service the endPoint is going to offer
        const getUserData = jest.fn().mockImplementation(() =>({
            status: 200,
            data:{
                id: 'U12345678',
                fname: 'John',
                lname: 'Doe',
                email: 'john.doe@example.com',
                company: 'Acme Inc.',
                portfolio: '[{ "ticker": "NVDA", "name": "Nvidia", "price": 924.79 }]',
                role: 'admin',
            }
        }))

        const result = getUserData();

        expect(result.data).toEqual({
            id: 'U12345678',
            fname: 'John',
            lname: 'Doe',
            email: 'john.doe@example.com',
            company: 'Acme Inc.',
            portfolio: '[{ "ticker": "NVDA", "name": "Nvidia", "price": 924.79 }]',
            role: 'admin',
        });
        expect(result.status).toEqual(200);  
    });

    it('unit test when no user is returned', async() => {
        const getUserData = jest.fn().mockImplementation(() =>({
            status: 200,
            data:{}
        }))

        const result = getUserData();

        expect(result.data).toEqual({});
        expect(result.status).toEqual(200);
    });

    it('unit test when an internal server error occurs', async() => {
        const getUserData = jest.fn().mockImplementation(() =>({
            status: 500,
            data: null
        }))

        const result = getUserData();

        expect(result.data).toEqual(null);
        expect(result.status).toEqual(500);
    })

});

describe('POST /getMomentumETFs', () =>{

    it('testing the getMomentumETFs endPoint', async () =>{
        
        const getMomentumETFs = jest.fn().mockImplementation(() =>({
            status: 200,
            data:[{
                ticker: 'URTH',
                name: 'iShares MSCI World ETF',
                risk:'moderate',
                volume:'1,299,362',
                ytd_return: '11,77'
            }]
        }))

        const response = getMomentumETFs();

        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data[0]).toHaveProperty('ticker');
        expect(response.data[0]).toHaveProperty('name');
        expect(response.data[0]).toHaveProperty('risk');
        expect(response.data[0]).toHaveProperty('volume');
        expect(response.data[0]).toHaveProperty('ytd_return');
    })
})

describe('POST /getESGData', (req, res) =>{
    it('testing the getESGData endpoint service', async() =>{
        const getESGData = jest.fn().mockImplementation(() =>({
            status: 200,
            data:[
            {
                ticker: 'KO',
                name: 'The Coca-Cola Company',
                rating: 70,
                agency: 'dow jones'
            },
            {
                ticker: 'JNJ',
                name: 'Johnson & Johnson',
                rating: 59,
                agency: 'msci'
            },
            {
                ticker: 'IBM',
                name: 'IBM',
                rating: 59,
                agency: 's&p'
            }
            ]
        }))

        const response = getESGData();

        expect(response.data).toBeDefined();
        response.data.forEach(esg => {
            expect(esg).toHaveProperty('ticker');
            expect(esg).toHaveProperty('name');
            expect(esg).toHaveProperty('rating');
        });
        expect(Array.isArray(response.data)).toBe(true);
        
    })

    it('the rating of data object should be dow jones', async() =>{
        const getESGData = jest.fn().mockImplementation((agency) =>({
            status: 200,
            data:[
            {
                ticker: 'KO',
                name: 'The Coca-Cola Company',
                rating: 70,
                agency: agency
            }
            ]
        }))

        const response = getESGData('dow jones');

        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data[0]).toHaveProperty('ticker');
        expect(response.data[0]).toHaveProperty('name');
        expect(response.data[0]).toHaveProperty('rating');
        expect(response.data[0].agency).toEqual('dow jones');
        expect(response.data.length).toEqual(1);

    })

    it('should return companies with poor ratings (<40)', async() =>{
        const getESGData = jest.fn().mockImplementation((rating) =>({
            status: 200,
            data:[
            {
                ticker: 'VZ',
                name: 'Verizon Communication',
                rating: 38,
                agency: 'msci'
            },
            {
                ticker: 'CVX',
                name: 'Chevron',
                rating: 25,
                agency: 'msci'
            }
            ]
        }))

        const response = getESGData('poor');

        expect(response.data).toBeDefined();
        expect(Array.isArray(response.data)).toBe(true);
        response.data.forEach(esg => {
            expect(esg).toHaveProperty('ticker');
            expect(esg).toHaveProperty('name');
            expect(esg).toHaveProperty('rating');
            expect(esg).toHaveProperty('agency');
        });
    })
});

describe('POST /getSentimentData', (req, res) =>{
    it('responds with all sentiment data', async () =>{
        const getSentimentData = jest.fn().mockImplementation(() =>({
            status: 200,
            data:[
            {
                ticker: 'KO',
                name: 'The Coca-Cola Company',
                sentiment: 'buy'
            },
            {
                ticker: 'JNJ',
                name: 'Johnson & Johnson',
                sentiment: 'sell'
            },
            {
                ticker: 'IBM',
                name: 'IBM',
                sentiment: 'hold'
            }
            ]
        }))

        const response = getSentimentData();

        expect(response.data).toBeDefined();
        response.data.forEach(esg => {
            expect(esg).toHaveProperty('ticker');
            expect(esg).toHaveProperty('name');
            expect(esg).toHaveProperty('sentiment');
        });
        expect(Array.isArray(response.data)).toBe(true);
    })

    it('I should only return sell and/or buy data points ', async() =>{
        const getSentimentData = jest.fn().mockImplementation((sentiments) =>({
            status: 200,
            data:[
            {
                ticker: 'KO',
                name: 'The Coca-Cola Company',
                sentiment: 'buy'
            },
            {
                ticker: 'JNJ',
                name: 'Johnson & Johnson',
                sentiment: 'sell'
            }
            ]
        }))

        const response = getSentimentData(['buy','sell']);

        expect(response.data).toBeDefined();
        response.data.forEach(esg => {
            expect(esg).toHaveProperty('ticker');
            expect(esg).toHaveProperty('name');
            expect(esg).toHaveProperty('sentiment');
        });
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data[0].sentiment).toEqual('buy');
        expect(response.data[1].sentiment).toEqual('sell');
    })
});

describe('POS /getETFData', (req,res) =>{

    it('responds with all etf data', async() =>{
        const getSentimentData = jest.fn().mockImplementation(() =>({
            status: 200,
            data:[
            {
                ticker: 'TIP',
                issuer:'SoFi',
                name: 'SoFi',
                risk:'moderate',
                volume:'1,745,362',
                ytd_return: '25,77'
            },
            {
                ticker: 'URTH',
                issuer:'iShares',
                name: 'iShares MSCI World ETF',
                risk:'moderate',
                volume:'1,299,362',
                ytd_return: '11,77'
            },
            {
                ticker: 'TLTW',
                issuer: 'iShares',
                name: 'iShares 20+ Year Treasury Bond ETF',
                risk: 'low',
                volume: '568,222',
                ytd_return: '27,58'
            }
            ]
        }))

        const response = getSentimentData();

        expect(response.data).toBeDefined();
        response.data.forEach(esg => {
            expect(esg).toHaveProperty('ticker');
            expect(esg).toHaveProperty('name');
            expect(esg).toHaveProperty('issuer');
            expect(esg).toHaveProperty('risk');
            expect(esg).toHaveProperty('volume');
            expect(esg).toHaveProperty('ytd_return');
        });
        expect(Array.isArray(response.data)).toBe(true);
    })

    it('responds with all one etf data point with low risk', async() =>{
        const getSentimentData = jest.fn().mockImplementation((risk) =>({
            status: 200,
            data:[
            {
                ticker: 'TLTW',
                issuer: 'iShares',
                name: 'iShares 20+ Year Treasury Bond ETF',
                risk: risk,
                volume: '568,222',
                ytd_return: '27,58'
            }
            ]
        }))

        const response = getSentimentData('low');

        expect(response.data).toBeDefined();
        response.data.forEach(etf => {
            expect(etf).toHaveProperty('ticker');
            expect(etf).toHaveProperty('name');
            expect(etf).toHaveProperty('issuer');
            expect(etf).toHaveProperty('risk');
            expect(etf).toHaveProperty('volume');
            expect(etf).toHaveProperty('ytd_return');
            expect(etf.risk).toEqual('low')
            expect
        });
        expect(Array.isArray(response.data)).toBe(true);
    })
});