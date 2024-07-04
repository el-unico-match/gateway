const axios = require('axios');
const MockAdapter = require("axios-mock-adapter");
const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
require('dotenv').config();
const {HTTP_SUCCESS_2XX, HTTP_CLIENT_ERROR_4XX, HTTP_SERVER_ERROR_5XX} = require('../../helpers/httpCodes');
const { SERVICES } = require('../../types/services');

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
            mock.onPost(`${urlUsers}/pin/${pin}`).replyOnce( (config) => {
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
            mock.onPost(`${urlUsers}/restorer/${pin}`).replyOnce( (config) => {
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
            mock.onGet(`${urlUsers}/user/${user.id}`).replyOnce( (config) => {
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
            mock.onGet(`${urlUsers}/user/${user.id}`).replyOnce( (config) => {
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
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            }); 
            mock.onGet(`${urlMatches}/user/${profile.userid}/match/profile/`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            }); 
            mock.onGet(`${urlMatches}/user/${profile.userid}/match/filter/`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            }); 
            let response = await request(app).get(`/api/user/profile/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body.profile)).toBe(JSON.stringify(profile));
            expect(JSON.stringify(response.body.pictures)).toBe(JSON.stringify(pictures.pictures));
        });

        test('Get user fail match filter profile', async () => {               
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
            mock.onGet(`${urlMatches}/user/${profile.userid}/match/profile/`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            }); 
            mock.onGet(`${urlMatches}/user/${profile.userid}/match/filter/`).networkErrorOnce();
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

    describe('User profile pictures', () => {       

        let token;

        let user;

        let profile;

        let pictures;

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

        test('Set user profile pictures', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onPut(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            const mockResponsePictures = {
                ...pictures
            }
            mock.onPut(`${urlMatches}/user/${profile.userid}/match/profile/complete`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            });
            let response = await request(app).put(`/api/user/profile/pictures/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body.pictures)).toBe(JSON.stringify(pictures.pictures));
        });

        test('Get user profile pictures', async () => {               
            const mockResponseProfile = {
                ...pictures
            };
            mock.onGet(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            let response = await request(app).get(`/api/user/profile/pictures/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(pictures));
        });

        test('Fail on set user profile pictures', async () => {               
            const mockResponseProfile = {
                msg: "Fail profile"
            };
            mock.onPut(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponseProfile];
            });
            let response = await request(app).put(`/api/user/profile/pictures/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(mockResponseProfile));
        });

        test('Fail on set user profile pictures', async () => {               
            mock.onPut(`${urlProfiles}/user/profile/pictures/${profile.userid}`).networkErrorOnce();

            let response = await request(app).put(`/api/user/profile/pictures/${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
            expect(response.headers['content-type']).toContain('json');                        
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });
   
    describe('Test Whitelist', () => {       

        let token;

        let user;

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

        test('Set whitelist', async () => {               
            const payload = {
                apikeys: `${token} ${token}`
            };     
            let response = await request(app).put(`/whitelist`)
                .send(payload)
                .set('x-token', token);               
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test get candidates', () => {       

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

        test('Get candidates', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            const mockResponsePictures = {
                ...pictures
            }
            mock.onGet(`${urlMatches}/user/${profile.userid}/profiles/filter`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponsePictures];
            }); 
            let response = await request(app).get(`/api/finder/candidates?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get candidates bad request', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            const mockResponsePictures = {
                ...pictures
            }
            mock.onGet(`${urlMatches}/user/${profile.userid}/profiles/filter`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponsePictures];
            }); 
            let response = await request(app).get(`/api/finder/candidates?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get candidates no content to return', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.NO_CONTENT_TO_RETURN, mockResponseProfile];
            });
            const mockResponsePictures = {
                ...pictures
            }
            mock.onGet(`${urlMatches}/user/${profile.userid}/profiles/filter`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.NO_CONTENT_TO_RETURN, mockResponsePictures];
            }); 
            let response = await request(app).get(`/api/finder/candidates?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test get candidates Rewind', () => {       

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

        test('Get candidates rewind', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlMatches}/user/${profile.userid}/rewind/`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/candidatesRewind?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get candidates rewind no content to return', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlMatches}/user/${profile.userid}/rewind/`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.NO_CONTENT_TO_RETURN, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/candidatesRewind?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get candidates rewind not Ok', async () => {               
            const mockResponseProfile = {
                profile
            };
            mock.onGet(`${urlMatches}/user/${profile.userid}/rewind/`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.BAD_REQUEST, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/candidatesRewind?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test get crushes', () => {       

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
            pictures = {
                userid: profile.userid,
                pictures: 
                {
                    name: "picture1",
                    url: "picture1.jpg",
                    order: 0
                }
            }
        });

        test('Get crushes', async () => {               
            const mockResponseProfile = [];
            mock.onGet(`${urlMatches}/user/${profile.userid}/matchs`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/crushes/?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get crushes Bad Request', async () => {               
            const mockResponseProfile = [];
            mock.onGet(`${urlMatches}/user/${profile.userid}/matchs`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponseProfile];
            });
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/crushes/?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test get likes', () => {       

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
            pictures = {
                userid: profile.userid,
                pictures: 
                {
                    name: "picture1",
                    url: "picture1.jpg",
                    order: 0
                }
            }
        });

        test('Get likes', async () => {               
            const mockResponseProfile = [];
            mock.onGet(`${urlMatches}/user/${profile.userid}/likes`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            mock.onGet(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/potencial/?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get likes bad request', async () => {               
            const mockResponseProfile = [];
            mock.onGet(`${urlMatches}/user/${profile.userid}/likes`).replyOnce( (config) => {
                return [HTTP_CLIENT_ERROR_4XX.BAD_REQUEST, mockResponseProfile];
            });
            mock.onGet(`${urlProfiles}/user/profile/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            mock.onGet(`${urlProfiles}/user/profile/pictures/${profile.userid}`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, mockResponseProfile];
            });
            let response = await request(app).get(`/api/finder/potencial/?profileId=${profile.userid}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test log', () => {       

        let token;

        let user;

        const {logError} = require('../../helpers/log/log');

        const {getLogLevel, LOG_LEVELS} = require('../../helpers/log/logLevel');

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

        test('Get log user service', async () => {               
            mock.onGet(`${urlUsers}/log`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, {}];
            });
            let response = await request(app).get(`/api/log`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get log profile service', async () => {               
            mock.onGet(`${urlProfiles}/log`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, {}];
            });
            let response = await request(app).get(`/api/log/${SERVICES.PROFILES}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get log matches service', async () => {               
            mock.onGet(`${urlMatches}/log`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, {}];
            });
            let response = await request(app).get(`/api/log/${SERVICES.MATCHES}`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get log micro-service services', async () => {               
            mock.onGet(`${urlServices}/log`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, {}];
            });
            let response = await request(app).get(`/api/log/${SERVICES.SERVICES}`)
                .set('x-token', token);
            //expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get log micro-service bad request', async () => {               
            let response = await request(app).get(`/api/log/FAKESERVICE`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_CLIENT_ERROR_4XX.BAD_REQUEST);
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Get log gateway', async () => {               
            let response = await request(app).get(`/api/log`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(response.headers['content-type']).toContain('json');            
        });
        
        test('Test log Error', async () => {   
            logError("Test Error");
        });

        test('Test log level', async () => {   
            expect(getLogLevel(LOG_LEVELS.DEBUG.level)).toBe(LOG_LEVELS.DEBUG);
            expect(getLogLevel(LOG_LEVELS.INFO.level)).toBe(LOG_LEVELS.INFO);
            expect(getLogLevel(LOG_LEVELS.WARNING.level)).toBe(LOG_LEVELS.WARNING);
            expect(getLogLevel(LOG_LEVELS.ERROR.level)).toBe(LOG_LEVELS.ERROR);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test handelAxiosRequestConfig', () => {       

        const {handleAxiosRequestConfig} = require('../../helpers/axiosHelper');

        let token;

        let user;

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

        test('Test handleAxiosRequestConfig', async () => {               
            const expectedData = {...user};
            mock.onGet(`${urlUsers}/user`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            const {data, status} = await handleAxiosRequestConfig({
                method: 'GET',
                headers: {},
                baseURL: urlUsers,
                url: `/user`,
            });            
            expect(status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(data)).toBe(JSON.stringify(expectedData));
        });

        test('Test handleAxiosRequestConfig network error', async () => {               
            mock.onGet(`${urlUsers}/user`).networkErrorOnce();;
            const {data, status} = await handleAxiosRequestConfig({
                method: 'GET',
                headers: {},
                baseURL: urlUsers,
                url: `/user`,
            });            
            expect(status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
        });

        test('Test handleAxiosRequestConfig', async () => {               
            const expectedData = {...user};
            mock.onGet(`${urlUsers}/user`).replyOnce( (config) => {
                throw new Error();
            });
            const {_data, status} = await handleAxiosRequestConfig({
                method: 'GET',
                headers: {},
                baseURL: urlUsers,
                url: `/user`,
            });            
            expect(status).toBe(HTTP_SERVER_ERROR_5XX.INTERNAL_SERVER_ERROR);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /api/user/match/push_notification', () => {       

        let token;

        let user;

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

        test('Test push notification', async () => {               
            const expectedData = {msg: "sended"};
            mock.onPost(`${urlMatches}/user/match/push_notification`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).post(`/api/user/match/push_notification`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /user/{id}/rewind', () => {       

        let token;

        let user;

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

        test('Test rewind', async () => {               
            const expectedData = {msg: "sended"};
            mock.onGet(`${urlMatches}/user/${user.id}/rewind`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).get(`/api/user/${user.id}/rewind`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /user/{id}/match/preference', () => {       

        let token;

        let user;

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

        test('Test preference', async () => {               
            const expectedData = {msg: "sended"};
            mock.onPost(`${urlMatches}/user/${user.id}/match/preference`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).post(`/api/user/${user.id}/match/preference`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /user/{id}/match/profile/block and /user/{id}/match/profile/unblock ', () => {       

        let token;

        let user;

        let profile

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

        test('Test block', async () => {               
            const expectedData = {...profile};
            mock.onPut(`${urlMatches}/user/${profile.userid}/match/profile/block`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).put(`/api/user/${profile.userid}/match/profile/block`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Test unblock', async () => {               
            const expectedData = {...profile};
            mock.onPut(`${urlMatches}/user/${profile.userid}/match/profile/unblock`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).put(`/api/user/${profile.userid}/match/profile/unblock`)
                .set('x-token', token);
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /user/match/notification', () => {       

        let token;

        let user;

        let profile

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

        test('Send notification', async () => {               
            const expectedData = {...profile};
            const payload = {
                userid_bloquer: profile.userid,
                userid_blocked: "66304a6b2891cdcfebdbdcAA"
            }
            mock.onPut(`${urlMatches}/user/match/notification`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).put(`/api/user/match/notification`)
                .set('x-token', token).send(payload);;
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /user/match/block', () => {       

        let token;

        let user;

        let profile

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

        test('Test /user/match/block', async () => {               
            const expectedData = {msg: "Ok"};
            const payload = {
                userid_bloquer: profile.userid,
                userid_blocked: "66304a6b2891cdcfebdbdcAA"
            }
            mock.onPost(`${urlMatches}/user/match/block`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).post(`/api/user/match/block`)
                .set('x-token', token).send(payload);;
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        test('Chande block state', async () => {               
            const expectedData = {...profile};
            const payload = {
                swiper_userid: profile.userid,
                swiped_userid: "66304a6b2891cdcfebdbdcAA",
                isBlocked: true
            }
            mock.onPut(`${urlMatches}/user/match/block`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).put(`/api/user/match/block`)
                .set('x-token', token).send(payload);;
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });

    describe('Test /user/match/block', () => {       

        let token;

        let user;

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

        test('Test get /user/match/swipes', async () => {               
            const expectedData = [];
            mock.onGet(`${urlMatches}/user/match/swipes`).replyOnce( (config) => {
                return [HTTP_SUCCESS_2XX.OK, expectedData];
            });
            let response = await request(app).get(`/api/user/match/swipes`)
                .set('x-token', token).send({});
            expect(response.status).toBe(HTTP_SUCCESS_2XX.OK);
            expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedData));
            expect(response.headers['content-type']).toContain('json');            
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });
    });
    
    describe('Service types', () => {       

        const {
            isService, 
            SERVICES} = require('../../types/services');

        test('Test services types', async () => {               
            expect(isService(SERVICES.USERS)).toBe(true);
            expect(isService(SERVICES.EVENTS)).toBe(true);
        });
    });

    describe('Service status', () => {       
        const {SERVICES} = require('../../types/services');

        const {getServiceStatus} = require('../../servicesStatus/servicesStatus');

        test('Test services types', async () => {               
            expect(getServiceStatus(SERVICES.EVENTS).name).toBe("events");
        });
    });

    describe('Test validateJWT', () => {       

        const {validateJWT} = require('../../middlewares/validateJWT');

        let token;

        let user;

        beforeAll( async () => {
            user = {
                id: "645547541243dfdsfe2132142134234203",
                email: "rafaelputaro@gmail.com",
                role: "administrador",
                blocked: true,
                verified: true
            } 
            token = await generateJWT(user.id, user.role, user.blocked);
        });

        test('Test validateJWT no token', async () => {               
            const response = validateJWT(
                {
                    header: () => undefined
                }, 
                undefined, 
                () => false);
            expect(response).toBe(undefined);
        });

        test('Test validateJWT, fail token', async () => {               
            const response = validateJWT(
                {
                    header: () => token
                }, 
                undefined, 
                () => false);
            expect(response).toBe(undefined);
        });

    });

    describe('Test validateApiKeys', () => {       

        const {doValidateApikey} = require('../../middlewares/validateApikeys');

        let token;

        beforeAll( async () => {
            tokenArg = {
                id: "645547541243dfdsfe2132142134234203"
            } 
            token = await generateJWT(tokenArg);
        });

        test('Test validateApiKey', async () => {               
            try {
                doValidateApikey(token);    
            } catch (error) {
                expect(true).toBe(true);
            }            
        });

    });

});