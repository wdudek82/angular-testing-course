import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { COURSES, LESSONS } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });
    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should retrieve all courses', () => {
    // WHEN
    coursesService.findAllCourses().subscribe((courses) => {
      // THEN
      expect(courses).toBeTruthy('No courses returned');
      expect(courses.length).toBe(12, 'Incorrect number of courses');

      // WHEN
      const course = courses.find((c) => c.id === 12);

      // THEN
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    // WHEN
    const req = httpTestingController.expectOne('/api/courses');

    // THEN
    expect(req.request.method).toEqual('GET');

    req.flush({ payload: Object.values(COURSES) });
  });

  it('should find a course by id', () => {
    const courseId = 12;
    coursesService.findCourseById(courseId).subscribe((course) => {
      expect(course).toBeTruthy('No course returned');
      expect(course.id).toBe(courseId);
      expect(course.titles.description).toBe('Angular Testing Course');
    });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

    expect(req.request.method).toBe('GET');

    req.flush(COURSES[courseId]);
  });

  it('should save the course data', () => {
    const courseId = 12;
    const changes: Partial<Course> = {
      titles: { description: 'This is the new title' },
    };
    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(courseId);
      expect(course.titles.description).toBe(changes.titles.description);
    });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toBe(
      changes.titles.description,
    );

    req.flush({
      ...COURSES[courseId],
      ...changes,
    });
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {
      titles: { description: 'This is the new title' },
    };
    coursesService.saveCourse(12, changes).subscribe(
      () => fail('the save course operation should have failed'),
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      },
    );

    const req = httpTestingController.expectOne('/api/courses/12');

    expect(req.request.method).toEqual('PUT');

    req.flush('Save course false', {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should find a list of lessons', () => {
    const courseId = 12;
    const filter = '';
    const sortOrder = 'asc';
    const pageNumber = 0;
    const pageSize = 3;

    coursesService
      .findLessons(courseId, filter, sortOrder, pageNumber, pageSize)
      .subscribe((lessons) => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

    const req = httpTestingController.expectOne(
      (request) => request.url === '/api/lessons',
    );

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('courseId')).toBe(courseId.toString());
    expect(req.request.params.get('filter')).toBe(filter.toString());
    expect(req.request.params.get('sortOrder')).toBe(sortOrder.toString());
    expect(req.request.params.get('pageNumber')).toBe(pageNumber.toString());
    expect(req.request.params.get('pageSize')).toBe(pageSize.toString());

    const payload = Object.values(LESSONS).filter(
      (lesson) => lesson.courseId === courseId,
    );
    req.flush({ payload: payload.slice(0, 3) });
  });
});
