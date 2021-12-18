'use strict';

// Import the Dialogflow module from Google client libraries.
const functions = require('firebase-functions');
const { google } = require('googleapis');
const { WebhookClient } = require('dialogflow-fulfillment');

// Enter your calendar ID below and service account JSON below
const calendarId = "v75ai50nppubig38hs26c4bpn4@group.calendar.google.com";
const serviceAccount = {
	"type": "service_account",
	"project_id": "appointment-scheduler-dem-tqke",
	"private_key_id": "d479ac424a2d3be8abdb9a662d8ea34120b3c78a",
	"private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDTSYr1T5zTPLD2\nf//TFelMuRNQmWuut2fpJp/KdFGDtGf4S8oyaqpRYUce7rEyPUUpBRyonvkUIiiq\nHQQyS955s52UquMaJgOqo/ivAKezKvfxkQ/sD2inLOWcD9hiSIpxh0n++w9LgcDx\nBSmKmrqpxErjwTD8xRkImCwIYzqGmsG++IvQmn0o3xv3GlH0HCWm5nJAY4d2oCbg\n/2LFQeJv/8JwTJwefKfDaQQk4+pL3r2WO3cxdcCseb0SFtPXam/aEH5bllH0QfoZ\nfqdAwo8SdlhUGB3TUFXkQ/aC2XLbHT5aiffI5wwKE0Pfc4/A5EBJ78H9C83W+D7m\n6PlM5I+dAgMBAAECggEAIjsy22NOc1N3ZjsUUvokpgIBf5hDqncGIO+ENEmbypyd\nZaG90g+W+tVUWk4Yq5zin26NF0KeSc/uSlVQ0JHwgEOEnx6qlETJaPQ6PlF7BLD2\n97kQB9JH8HclLMoiaBX8RsAWUcxnd3e/ryzYxJ8kk+GnXSFNKFQJ0MB6uHx/HGnF\nyg3dsLrvdD+qsj9Ar6GUCkJIh8xekZ+Za0R4/bVB0+XugfKYXf9OIyfPTiMR9j/I\nUkIEyM4UaldUQzrgfp2koUtGiVeriKuh8vnEF1U5ty+Z4DDH15cuo++eR4DStBZT\n84eGwVIjftEjh13Xxufi66froz4fD5tmAskuU6NZDwKBgQD17BJr7f2MHyT2/L5N\nAEqaWheUyLLOEEP1+8soZRnLLaz+AvOQlJ1yqnFoDOTFaAmJaUkNHQLsdmBMeuvN\nUufXV/ULF/aYYTBjNNTFkTl6vq9iMhzNsvd6MHlltDxgiEU3vYTDCbuEMhYRN6Jf\nu/26MQbohrPP5vIQidNqs5zFfwKBgQDb8h9ErvEEnoV8FCu8ZBkk0Zqw+VBtMfTH\n0kzRgt2UtKYCui1WYQRIK3cWFuswvI4d3lSzBqw48Di6gvGylu1ZvxSkpbxzjcKq\nTKmdYOuCRMn6UBjY8JZ+rn4on4oizBP/3as5J5QeLEmq7AhTFfFNI7gH6j+FR5wv\nXR+wTzaQ4wKBgF8nXuFgDrD/BACFPuTwbe1XWrR5C6Zr6L/vE2an59kT7VHDtpaE\nyn8psAPAqWwwmzAOCvQF+7GfBBfToBWsNITARdJrDUFcqapZMNLZJFJ4Ichu93Io\nA1XGF9LgcFQxpgaxUANfaqz17E/xJOTCCqTWf4PNSxnwlE0N5z3sDYblAoGAbycN\nZkiCxTLXgr0u3SY5DsJeytE0M/rrGZDOAZOBJ4Wj3/z2rJCa+V398MvkT9z6dV3G\nsDLPFndQM/G48+gSSyil5g9cDYm2txnHHiG84zigWj/gTsJHS/4jA6ScyrkX4lbE\nET5PPHBlSlu+WT7dk35ZoqZfM5vc8pK9UPy3NsECgYEA3CBejBzCKh+lhcAshiDK\nI0wrM3K6AA7Pxi0KerFWbKbIlvw4pZ6Eu4mf5D2Nw1rvCXA5L4TNwYya4WyBNkWD\nPVUbZIbCRpirdY4vC+mhcMosRKgEW8zXRPWxgwM6RN1k0F6kJPDYSbBB8sQUS3Ox\nEx+9I2z1wehH/P1rBQeRoxc=\n-----END PRIVATE KEY-----\n",
	"client_email": "appointment-scheduler-demo@appointment-scheduler-dem-tqke.iam.gserviceaccount.com",
	"client_id": "110805255843967799746",
	"auth_uri": "https://accounts.google.com/o/oauth2/auth",
	"token_uri": "https://oauth2.googleapis.com/token",
	"auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
	"client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/appointment-scheduler-demo%40appointment-scheduler-dem-tqke.iam.gserviceaccount.com"
}; // Starts with {"type": "service_account",...

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
	email: serviceAccount.client_email,
	key: serviceAccount.private_key,
	scopes: 'https://www.googleapis.com/auth/calendar'
});

const calendar = google.calendar('v3');
process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

const timeZone = 'America/Los_Angeles';
const timeZoneOffset = '-07:00';

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(async (request, response) => {
	console.log('<<<<<<<<<<<<<<<<<<<< dialogflowFirebaseFulfillment >>>>>>>>>>>>>>>>>>>>>');

	const agent = new WebhookClient({ request, response });
	console.log("Parameters", agent.parameters);

	async function makeAppointment(agent) {
		console.log('<<<<<<<<<<<<<<<<<<<< makeAppointment >>>>>>>>>>>>>>>>>>>>>');

		let date = agent.parameters.date;
		let time = agent.parameters.time;

		console.log('Date: ', date);
		console.log('Time: ', time);

		// date = '2021-11-19T00:00:00.05:00';
		// time = '2021-11-19T00:00:00.05:00';

		// Calculate appointment start and end datetimes (end = +1hr from start)
		const dateTimeStart = new Date(Date.parse(date.split('T')[0] + 'T' + time.split('T')[1].split('+')[0] + timeZoneOffset));
		const dateTimeEnd = new Date(new Date(dateTimeStart).setHours(dateTimeStart.getHours() + 1));

		console.log('dateTimeStart: ', dateTimeStart);
		console.log('dateTimeEnd: ', dateTimeEnd);

		const appointmentTimeString = dateTimeStart.toLocaleString(
			'en-US',
			{ month: 'long', day: 'numeric', hour: 'numeric', timeZone: timeZone }
		);

		console.log('appointmentTimeString: ', appointmentTimeString);

		// Check the availability of the time, and make an appointment if there is time on the calendar
		return createCalendarEvent(dateTimeStart, dateTimeEnd).then(() => {
			agent.add(`Ok, let me see if we can fit you in. ${appointmentTimeString} is fine!.`);
		}).catch(() => {
			agent.add(`I'm sorry, there are no slots available for ${appointmentTimeString}.`);
		});
	}

	// Handle the Dialogflow intent named 'Schedule Appointment'.
	let intentMap = new Map();
	intentMap.set('Default Welcome Intent - ChatBotsCourseQuery - no - yes - ProvidesCallTime', makeAppointment);
	agent.handleRequest(intentMap);
});

//Creates calendar event in Google Calendar
function createCalendarEvent(dateTimeStart, dateTimeEnd) {
	console.log('<<<<<<<<<<<<<<<<<<<< createCalendarEvent >>>>>>>>>>>>>>>>>>>>>');

	return new Promise((resolve, reject) => {
		// Create event for the requested time period
		calendar.events.insert({
			auth: serviceAccountAuth,
			calendarId: calendarId,
			resource: {
				summary: ' Appointment', description: "LWS Academy Appointment",
				start: { dateTime: dateTimeStart },
				end: { dateTime: dateTimeEnd }
			}
		}, (err, event) => {
			console.log(err);
			err ? reject(err) : resolve(event);
		}
		);
	});
}