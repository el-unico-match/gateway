const axios = require('axios');
const MockAdapter = require("axios-mock-adapter");
const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();
const {HTTP_SUCCESS_2XX, HTTP_CLIENT_ERROR_4XX} = require('../../helpers/httpCodes');

process.env.PORT ||= 4001;
process.env.MATCHES_API_DOMAIN ||= "https://match-api-uniquegroup-match-fiuba.azurewebsites.net"; 
process.env.MESSAGES_API_DOMAIN ||= "https://messages-uniquegroup-match-fiuba.azurewebsites.net";
process.env.PROFILES_API_DOMAIN ||= "https://profile-uniquegroup-match-fiuba.azurewebsites.net";
process.env.SERVICES_API_DOMAIN ||= "https://services-uniquegroup-match-fiuba.azurewebsites.net/";
process.env.USERS_API_DOMAIN ||= "https://users-uniquegroup-match-fiuba.azurewebsites.net/api";
process.env.SECRET_JWT_SEED ||= "Secreto 12445";
process.env.HOST ||= "0.0.0.0";
process.env.IS_APIKEY_CHECKING_DISABLED=true

/**
 * 
 * @description Genera el JWT según los parámetros
 */
const generateJWT = (uid, role, blocked) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid,
            role,
            blocked
        }
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: 100000
        }, (error, token) => {
            if (error) {
                logWarning(`On generate JWT: ${error}`);
                reject(MSG_TOKEN_COULD_NOT_BE_GENERATED)
            }
            resolve(token)
        });
    });
}

let mock = new MockAdapter(axios);

describe('Pruebas sobre la API de trips', () => {

    let app;

    const urlMatches = process.env.MATCHES_API_DOMAIN;
    const urlProfiles = process.env.PROFILES_API_DOMAIN;
    const urlServices = process.env.SERVICES_API_DOMAIN;
    const urlUsers = process.env.USERS_API_DOMAIN;    

    beforeAll(async () => {
        // Crear servidor express
        app = express();
        // Lectura y parseo del body
        app.use(express.json());
        // Rutas Status
        app.use('/api/status', require('../../routes/status'));
        // Rutas Api
        app.use('/api/login', require('../../routes/login'));
        app.use('/api/services', require('../../routes/services'));
        app.use('/api/token', require('../../routes/token'));
        app.use('/api/user', require('../../routes/user'));
        app.use('/api/users', require('../../routes/users'));
        app.use('/api/finder', require('../../routes/finder'));
        app.use('/api/match', require('../../routes/match'));
        app.use('/api/restorer', require('../../routes/restorer'));
        app.use('/api/pin', require('../../routes/pin'));
        app.use('/whitelist', require('../../routes/whitelist'));
        // Ruta log
        app.use('/api/log', require('../../routes/log'));
        
    });

    describe('Test Status', () => {       
        
        test('Todos los services retornan status correcto', async () => {       
            mock.onGet(`${urlMatches}/status`).replyOnce(HTTP_SUCCESS_2XX.OK, {
                ok: true,
                status: `Service is online on ${urlMatches}`,
            });
            mock.onGet(`${urlProfiles}/status`).replyOnce(HTTP_SUCCESS_2XX.OK, {
                ok: true,
                status: `Service is online on ${urlProfiles}`,
            });
            mock.onGet(`${urlServices}/status`).replyOnce(HTTP_SUCCESS_2XX.OK, {
                ok: true,
                status: `Service is online on ${urlServices}`,
            });
            mock.onGet(`${urlUsers}/status`).replyOnce(HTTP_SUCCESS_2XX.OK, {
                ok: true,
                status: `Service is online on ${urlUsers}`,
            });
            let response = await request(app).get('/api/status');
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.body.ok).toBe(true);
            expect(response.body.services.matches.target).toBe(urlMatches);
            expect(response.body.services.matches.online).toBe(true);
            expect(response.body.services.matches.detail).toBe(`Service is online on ${urlMatches}`);
            expect(response.body.services.profiles.target).toBe(urlProfiles);
            expect(response.body.services.profiles.online).toBe(true);
            expect(response.body.services.profiles.detail).toBe(`Service is online on ${urlProfiles}`);
            expect(response.body.services.services.target).toBe(urlServices);
            //expect(response.body.services.services.online).toBe(true);
            //expect(response.body.services.services.detail).toBe(`Service is online on ${urlServices}`);
            expect(response.body.services.users.target).toBe(urlUsers);
            expect(response.body.services.users.online).toBe(true);
            expect(response.body.services.users.detail).toBe(`Service is online on ${urlUsers}`);
        });

        test('Todos los services retornan status incorrecto', async () => {       
            mock.onGet(`${urlMatches}/status`).replyOnce(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, {
                ok: false,
                status: `Error ${urlMatches}`,
            });
            mock.onGet(`${urlProfiles}/status`).replyOnce(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, {
                ok: false,
                status: `Error ${urlProfiles}`,
            });
            mock.onGet(`${urlServices}/status`).replyOnce(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, {
                ok: false,
                status: `Error ${urlServices}`,
            });
            mock.onGet(`${urlUsers}/status`).replyOnce(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, {
                ok: false,
                status: `Error ${urlUsers}`,
            });
            let response = await request(app).get('/api/status');
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.body.ok).toBe(true);
            expect(response.body.services.matches.target).toBe(urlMatches);
            expect(response.body.services.matches.online).toBe(false);
            expect(response.body.services.profiles.target).toBe(urlProfiles);
            expect(response.body.services.profiles.online).toBe(false);            
            expect(response.body.services.services.target).toBe(urlServices);
            expect(response.body.services.services.online).toBe(false);            
            expect(response.body.services.users.target).toBe(urlUsers);
            expect(response.body.services.users.online).toBe(false);            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

    });

    describe('Test Login', () => {       
        
        let user;

        let token;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Se loguea correctamente', async () => {       
            
            const loginResponse = {
                ok: true,
                user: user,
                token: token
            }
            mock.onPost(`${urlUsers}/login`).replyOnce( (config) => {
                return [202, loginResponse];
            } );
            const payload = {
                email: "rafaelputaro22@gmail.com",
                password: "112323232"
            };            
            let response = await request(app).post('/api/login').send(payload);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.ACCEPTED);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(loginResponse));
        });
        
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test token', () => {       
        
        let user;

        let token;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Renew token', async () => {               
            const mockResponse = {
                ok: true,
                token: token
            }
            mock.onPost(`${urlUsers}/token`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.CREATED, mockResponse];
            } );
            let response = await request(app).post('/api/token').set('x-token', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });
        
        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test pin', () => {       
        
        let user;

        let token;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            };    
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Init verification', async () => {               
            const mockResponse = {
                ok: true,
                user: {
                    email: user.email
                },
                token: token
            };
            mock.onPost(`${urlUsers}/pin`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.CREATED, mockResponse];
            });
            let response = await request(app).post('/api/pin').send({
                email: user.email
            });
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });
        
        test('Finalize verification', async () => {               
            const mockResponse = {
                ok: true,
                user: user,
                token: token
            }
            const pin = 'A2D23';
            mock.onPost(`${urlUsers}/pin`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            } );
            let response = await request(app)
                .post(`/api/pin/${pin}`)
                .set('x-token', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test restorer', () => {       
        
        let user;

        let token;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Init password restauration', async () => {               
            const mockResponse = {
                ok: true,
                user: {
                    email: user.email
                },
                token: token
            };
            mock.onPost(`${urlUsers}/restorer`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.CREATED, mockResponse];
            });
            let response = await request(app).post('/api/restorer').send({
                email: user.email
            });
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });
        
        test('Finalize password restauration', async () => {               
            const mockResponse = {
                ok: true,
                user: user,
                token: token
            }
            const pin = 'A2D23';
            mock.onPost(`${urlUsers}/restorer`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            } );
            let response = await request(app)
                .post(`/api/restorer/${pin}`)
                .set('x-token', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test get users', () => {       
        
        let user;

        let token;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Get users', async () => {               
            const mockResponse = {
                ok: true,
                users: [
                    {
                        id: "645547541243dfdsfe2132142134234203",
                        email: "rafaelputaro@gmail.com",
                        role: "administrador",
                        blocked: false,
                        verified: true
                    }
                ]
            };
            mock.onGet(`${urlUsers}/users`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).get('/api/users')
                .set('x-token', token)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });
        
        test('Fail on get users', async () => {               
            const mockResponse = {
                ok: false,
                msg: "Fail"
            };
            mock.onGet(`${urlUsers}/users`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).get('/api/users')
                .set('x-token', token)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test user ID', () => {       
        
        let user;

        let token;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Get user', async () => {               
            const mockResponse = {
                ok: true,
                user: {
                    id: "645547541243dfdsfe2132142134234203",
                    email: "rafaelputaro@gmail.com",
                    role: "administrador",
                    blocked: false,
                    verified: true
                }
            };
            mock.onGet(`${urlUsers}/user`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).get(`/api/user/${user.id}`)
                .set('x-token', token)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });
        
        test('Fail get user', async () => {               
            const mockResponse = {
                ok: false,
                msg: "Fail"
            };
            mock.onGet(`${urlUsers}/user`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).get(`/api/user/${user.id}`)
                .set('x-token', token)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test create user', () => {       
        
        let user;

        let token;

        beforeAll(async  () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
            
        });

        test('Create user', async () => {               
            const mockResponse = {
                ok: true,
                user: {
                    id: "645547541243dfdsfe2132142134234203",
                    email: "rafaelputaro@gmail.com",
                    role: "administrador",
                    blocked: false,
                    verified: true
                },
                token
            };
            mock.onPost(`${urlUsers}/user`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.CREATED, mockResponse];
            });
            let response = await request(app).post(`/api/user`)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.CREATED);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });
        
        test('Fail on create user', async () => {               
            const mockResponse = {
                ok: false,
                msg: "Fail"
            };
            mock.onPost(`${urlUsers}/user`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).post(`/api/user`)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test current user', () => {       
        
        let user;

        let token;

        beforeAll(async  () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            }    
            token = await generateJWT(user.id, user.role, user.blocked);
            
        });

        test('Get data from current user', async () => {               
            const mockResponse = {
                ok: true,
                user: {
                    id: "645547541243dfdsfe2132142134234203",
                    email: "rafaelputaro@gmail.com",
                    role: "administrador",
                    blocked: false,
                    verified: true
                }
            };
            mock.onGet(`${urlUsers}/user/current`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).get(`/api/user/current`)
                .set('x-token', token)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        test('Fail o get data from current user', async () => {               
            const mockResponse = {
                ok: false,
                msg: "Fail"
            };
            mock.onGet(`${urlUsers}/user/current`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).get(`/api/user/current`)
                .set('x-token', token)
                .set('x-apikey', token);
            expect(response.headers['content-type']).toContain('json');
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });        

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });
    
    describe('Get users profiles', () => {       

        let token;

        let user;

        let profile;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
            profile = {
                userid: "66304a6b2891cdcfebdbdc6c",
                username: "Carlos Carlin",
                email: "carlin@mail.com",
                description: "Argentino. Estudié en la UBA.",
                gender: "Hombre",
                looking_for: "Mujer",
                age: 33,
                education: "Ingeniero Civil",
                ethnicity: "europeo"
              }
        });

        test('Get users profiles', async () => {               
            const mockResponse = {
                ok: true,
                profiles: [profile]
            };
            mock.onGet(`${urlProfiles}/users/profiles`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).get(`/api/users/profiles`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        test('Fail get users profiles', async () => {               
            const mockResponse = {
                ok: false,
                msg: "Fail"
            };
            mock.onGet(`${urlProfiles}/users/profiles`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).get(`/api/users/profiles`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });        

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('User profile', () => {       

        let token;

        let user;

        let profile;

        let picture;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
            profile = {
                userid: "66304a6b2891cdcfebdbdc6c",
                username: "Carlos Carlin",
                email: "carlin@mail.com",
                description: "Argentino. Estudié en la UBA.",
                gender: "Hombre",
                looking_for: "Mujer",
                age: 33,
                education: "Ingeniero Civil",
                ethnicity: "europeo"
            }
            pictures = {
                userid: profile.userid,
                pictures: [
                  {
                    name: "picture1",
                    url: "picture1.jpg",
                    order: 0
                  }
                ]
              }
        });

        test('Get user profile', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            const mockResponsePictures = {
                ...pictures
            }
            mock.onGet(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            });
            let response = await request(app).get(`/api/user/profile/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body.profile)).toBe(JSON.stringify(profile));
            expect(JSON.stringify(response.body.pictures)).toBe(JSON.stringify(pictures.pictures));
        });

        test('Get user profile', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            const mockResponsePictures = {
                ...pictures
            }
            mock.onGet(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponsePictures];
            });
            let response = await request(app).get(`/api/user/profile/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');
        });

        test('Fail on get user profile', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponseProfile];
            });
            let response = await request(app).get(`/api/user/profile/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('User match profiles', () => {       

        let token;

        let user;

        let profile;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
            profile = {
                userid: "66304a6b2891cdcfebdbdc6c",
                username: "Carlos Carlin",
                email: "carlin@mail.com",
                description: "Argentino. Estudié en la UBA.",
                gender: "Hombre",
                looking_for: "Mujer",
                age: 33,
                education: "Ingeniero Civil",
                ethnicity: "europeo"
              }
        });

        test('Create user profile', async () => {               
            const mockResponse = {
                ...profile
            };
            mock.onPost(`${urlMatches}/user/match/profile`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).post(`/api/user/match/profile`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        test('Fail on create user profile', async () => {               
            const mockResponse = {
                msg: "fail"
            };
            mock.onPost(`${urlMatches}/user/match/profile`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).post(`/api/user/match/profile`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('User match filter', () => {       

        let token;

        let user;

        let profile;

        let profileMatch;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
            profile = {
                userid: "66304a6b2891cdcfebdbdc6c",
                username: "Carlos Carlin",
                email: "carlin@mail.com",
                description: "Argentino. Estudié en la UBA.",
                gender: "Hombre",
                looking_for: "Mujer",
                age: 33,
                education: "Ingeniero Civil",
                ethnicity: "europeo"
            }
            profileMatch = {
                userid: "66304a6b2891cdcfebdbdc6A",
                username: "Carla Rosarina",
                email: "carlaRosarina@mail.com",
                description: "Argentina. Estudié en la UTN.",
                gender: "Mujer",
                looking_for: "Hombre",
                age: 33,
                education: "Ingeniera Electrónica",
                ethnicity: "europeo"
            }
        });

        test('Get match filtered', async () => {               
            const mockResponse = {
                ...profileMatch
            };
            mock.onGet(`${urlMatches}/user/${profile.userid}/profiles/filter`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).get(`/api/user/${profile.userid}/profiles/filter`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        test('Fail get match filtered', async () => {               
            const mockResponse = {
                msg: "Fail"
            };
            mock.onGet(`${urlMatches}/user/${profile.userid}/profiles/filter`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).get(`/api/user/${profile.userid}/profiles/filter`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('User id match', () => {       

        let token;

        let user;

        let profile;

        let profileMatch;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
            profile = {
                userid: "66304a6b2891cdcfebdbdc6c",
                username: "Carlos Carlin",
                email: "carlin@mail.com",
                description: "Argentino. Estudié en la UBA.",
                gender: "Hombre",
                looking_for: "Mujer",
                age: 33,
                education: "Ingeniero Civil",
                ethnicity: "europeo"
            }
            profileMatch = {
                userid: "66304a6b2891cdcfebdbdc6A",
                username: "Carla Rosarina",
                email: "carlaRosarina@mail.com",
                description: "Argentina. Estudié en la UTN.",
                gender: "Mujer",
                looking_for: "Hombre",
                age: 33,
                education: "Ingeniera Electrónica",
                ethnicity: "europeo"
            }
        });

        test('Update match', async () => {               
            const mockResponse = {
                ...profileMatch
            };
            mock.onPut(`${urlMatches}/user/${profile.userid}/match/profile`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).put(`/api/user/${profile.userid}/match/profile`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        test('Fail on update match', async () => {               
            const mockResponse = {
                msg: "Fail"
            };
            mock.onPut(`${urlMatches}/user/${profile.userid}/match/profile`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).put(`/api/user/${profile.userid}/match/profile`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('User id matchs', () => {       

        let token;

        let user;

        let profile;

        let profileMatch;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: false,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
            profile = {
                userid: "66304a6b2891cdcfebdbdc6c",
                username: "Carlos Carlin",
                email: "carlin@mail.com",
                description: "Argentino. Estudié en la UBA.",
                gender: "Hombre",
                looking_for: "Mujer",
                age: 33,
                education: "Ingeniero Civil",
                ethnicity: "europeo"
            }
            profileMatch = {
                userid: "66304a6b2891cdcfebdbdc6A",
                username: "Carla Rosarina",
                email: "carlaRosarina@mail.com",
                description: "Argentina. Estudié en la UTN.",
                gender: "Mujer",
                looking_for: "Hombre",
                age: 33,
                education: "Ingeniera Electrónica",
                ethnicity: "europeo"
            }
        });

        test('Get matchs', async () => {               
            const mockResponse = [
                {
                    myself: {},
                    matched: {}
                }
            ];
            mock.onGet(`${urlMatches}/user/${profile.userid}/matchs`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponse];
            });
            let response = await request(app).get(`/api/user/${profile.userid}/matchs`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        test('Fail on get matchs', async () => {               
            const mockResponse = [];
            mock.onGet(`${urlMatches}/user/${profile.userid}/matchs`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponse];
            });
            let response = await request(app).get(`/api/user/${profile.userid}/matchs`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponse));
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });


});