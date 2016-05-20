'use strict'
const request = require('request');
//returns all courses from a department: [{course},{course},{course}]
function requestDept(dept, term, cb) {
  var url = 'http://web-app.usc.edu/web/soc/api/classes/' + dept + '/' + term;
  request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      //parses the body text into a JSON object
      if(response.body.indexOf('ERROR')>-1){
        return cb(new Error('Error: invalid course'));
      }else{
        let metaResponse = JSON.parse(body);
        let deptResponse = metaResponse.OfferedCourses.course;
        cb(null,deptResponse);
      }
    } else {
      return cb(err);
    }
  });
} //END requestDept()

//returns an individual course from Department
function requestCourse(coursename, dept, term, cb) {
  requestDept(dept, term, function(err,courses) {
    if(err){
      return cb(err);
    }
    else{
      //filter out course we want
      let course = courses.filter(course => course.PublishedCourseID == coursename);
      cb(null,course);
    }
  });
}

//returns section data from a course
export function requestSection(coursename, dept, term, cb) {
  requestCourse(coursename, dept, term, function(err,course) {
    if(err){
      return cb(err);
    }
    //section array [lecture, lecture, quiz, etc]
    let section = course[0].CourseData.SectionData;
    cb(null,section);
  });
}

//
// module.exports.requestDept = requestDept;
// module.exports.requestCourse = requestCourse;
// module.exports.requestSection = requestSection;
