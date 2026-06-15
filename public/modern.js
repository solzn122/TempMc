"use strict";
			window.addEventListener("load", async function() {
				if(window.location.href.indexOf("file:") === 0) {
					alert("HTTP please, do not open this file locally, run a local HTTP server and load it via HTTP");
				}else {

					// %%%%%%%%% launch options %%%%%%%%%%%%

					var relayId = Math.floor(Math.random() * 3);

					var parts = await Promise.all([
						fetch("assets_part1.bin").then(function(r) { return r.arrayBuffer(); }),
						fetch("assets_part2.bin").then(function(r) { return r.arrayBuffer(); })
					]);
					var combined = new Uint8Array(parts[0].byteLength + parts[1].byteLength);
					combined.set(new Uint8Array(parts[0]), 0);
					combined.set(new Uint8Array(parts[1]), parts[0].byteLength);
					var epwURL = URL.createObjectURL(new Blob([combined], {type: "application/octet-stream"}));

					window.eaglercraftXOpts = {
						demoMode: false,
						container: "game_frame",
						assetsURI: epwURL,
						worldsDB: "worlds",
						servers: [
							/* example: { addr: "ws://localhost:8081/", name: "Local test server" } */
						],
						relays: [
							{ addr: "wss://relay.deev.is/", comment: "lax1dude relay #1", primary: relayId == 0 },
							{ addr: "wss://relay.lax1dude.net/", comment: "lax1dude relay #2", primary: relayId == 1 },
							{ addr: "wss://relay.shhnowisnottheti.me/", comment: "ayunami relay #1", primary: relayId == 2 }
						]
					};

					// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

					var q = window.location.search;
					if((typeof q === "string") && q[0] === "?" && (typeof window.URLSearchParams !== "undefined")) {
						q = new window.URLSearchParams(q);
						var s = q.get("server");
						if(s) window.eaglercraftXOpts.joinServer = s;
					}

					main();

				}
			});