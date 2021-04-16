module.exports = {
    urls: {
        localhost: 'http://localhost:8000',
        staging: 'https://dashboard-stg.kick.app',
        production: 'https://dashboard.kick.app'
    },
    parseArgs(args) {
        args = (args.slice(2).join('||') + '||').split('--');

        return args.reduce(($, arg) => {
            if(arg) {
                let [name, value] = arg.split('||');

                if(name.includes('=')) {
                    [name, value] = name.split('=');
                }

                $[name] = value;
            }

            return $;
        }, {});
    },
    makeRequest(lib, url, opts, data) {
        return new Promise((resolve, reject) => {
            const request = lib.request(url, opts, response => {
                let data = "";

                response.on('data', chunk => {
                    data += chunk;
                });

                response.on('end', () => {
                    if(response.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(`Request failed with status code ${response.statusCode}: ${data}`);
                    }
                });

                response.on('error', e => {
                    reject(e);
                })
            });

            if(data) {
                request.write(data);
            }

            request.on('error', e => {
                reject(e);
            });

            request.end();
        })
    }
};
