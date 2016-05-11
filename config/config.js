// data base connection configuration..
var dbconfig = {
    dev : {
        mssql: {
            userName: 'bnsAdmin',
            password: 'b1n2s32015',
            server: 'podiumdev.adcore.com',
            // If you are on Microsoft Azure, you need this:
            options: { database: 'adcore23072015', port: '2433', rowCollectionOnDone: true, rowCollectionOnRequestCompletion: true }
        },
        mongo: {
            url: 'mongodb://bnsAdmin:b1n2s32015@ds045454.mongolab.com:45454/bns'
        }
    },   
    prod: {
        mssql: {
            userName: 'bnsAdmin',
            password: 'b1n2s32015',
            server: 'podiumdev.adcore.com',
            // If you are on Microsoft Azure, you need this:
            options: { database: 'dbAdCore', port: '2433', rowCollectionOnDone: true, rowCollectionOnRequestCompletion: true }
        },
        mongo: {
            url: 'mongodb://bnsAdmin:b1n2s32015@ds045454.mongolab.com:45454/bns'
        }
    },
    stage: {
        mssql: {
            userName: 'bnsAdmin',
            password: 'b1n2s32015',
            server: 'podiumdev.adcore.com',
            // If you are on Microsoft Azure, you need this:
            options: { database: 'adcore23072015', port: '2433', rowCollectionOnDone: true, rowCollectionOnRequestCompletion: true }
        },
        mongo: {
            url: 'mongodb://bnsAdmin:b1n2s32015@ds045454.mongolab.com:45454/bns'
        }
    }
}

// common config
var commonConfig = {
    dev: {
        'win32': {
            folder: {
                'temp' : 'C:\\inetpub\\wwwroot\\adCore.nodejs.v6\\adcore.api\\Files\\Temp\\',
            }
        },
        'linux': {
            folder: {
                'temp' : '/Files/Temp/'
            }
        },
        'darwin': {
            folder: {
                'temp' : '/Users/abentov/adCore.nodejs.v6/adcore.api/Files/Temp/'
            }
        }
    },
    prod: {
        'win32': {
            folder: {
                'temp' : 'C:\\inetpub\\wwwroot\\adCore.nodejs.v6\\adcore.api\\Files\\Temp\\'
            }
        },
        'linux': {
            folder: {
                'temp' : '/Files/Temp/'
            }
        }
    },
    stage: {
        'win32': {
            folder: {
                'temp' : 'C:\\inetpub\\wwwroot\\adCore.nodejs.v6\\adcore.api\\Files\\Temp\\'
            }
        },
        'linux': {
            folder: {
                'temp' : '/Files/Temp/'
            }
        }
    }
}

// config object
var appData = {
    version: '1.00',
    mssql_db_environment: 'dev',
    mongo_db_environment: 'dev',
    sys_environment: 'dev',
    connection: '',
    common: null,
    dbconfig: { mssql: null, mongo: null },
    mail: {
        service: 'gmail',
        auth: {
            user: 'benarikutai@gmail.com',
            pass: 'benariku123456'
        },
        sendFrom: 'benarikutai@gmail.com'
    },
    surveys: {
        expirationDefaultInDays:7
    }
}

// get relevant config by environment
appData.common = commonConfig[appData.sys_environment][process.platform] || commonConfig['dev'][process.platform];
appData.dbconfig.mssql = dbconfig[appData.mssql_db_environment].mssql;
appData.dbconfig.mongo = dbconfig[appData.mongo_db_environment].mongo;


module.exports = appData;
