/*
Author: Praveen
Created: 2015-06-29
*/

var config = {
	server: {
		host: "127.0.0.1",
		port: "3000"
	},
	db: {
		host: "127.0.0.1",
		port: "7474",
		username: "neo4j",
		password: "post123",
		transactionUrl: "http://localhost:7474/db/data/transaction/commit"
	}
}

module.exports = config;