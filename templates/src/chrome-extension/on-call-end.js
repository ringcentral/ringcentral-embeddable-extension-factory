/**
 * when call end, ringcentral widgets sync call data,
 * it is a good time to sync log to third party api if possible
 */

export default (data) => {
  console.log('recieved call end event data', data)
}
