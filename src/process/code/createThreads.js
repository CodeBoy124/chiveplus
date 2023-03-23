import { Worker } from "worker_threads";
export async function createThreads(amount, threadAreas, supportData){
	let threads = [];
	let output = [];
	let threadPromises = [];
	for(let threadIndex = 0; threadIndex < amount; threadIndex++){
		threads.push(new Worker("./src/process/code/threadRunner.js", {
			type: "module",
			workerData: {
				areas: threadAreas[threadIndex],
				supportData: supportData.code,
				threadIndex
			}
		}));

		threadPromises.push(new Promise((res, rej) => {
			threads[threadIndex].addListener("message", data => {
				output.push(...data.output);
				for(let warning of data.warnings){
					console.warn(warning);
				}
				for(let error of data.errors){
					throw new Error(error);
				}
				res();
			});
			threads[threadIndex].addListener("error", msg => {
				rej(msg);
			});
		}));
	}
	await Promise.all(threadPromises);
	return output;
}
