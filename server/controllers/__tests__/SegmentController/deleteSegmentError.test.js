/* eslint-disable no-undef */
const SegmentController = require('../../segment.controller');
const request = require('../../__mocks__/request');
const response = require('../../__mocks__/response');
const segmentService = require('../../__mocks__/segmentService');
const projectService = require('../../__mocks__/projectService');
const issueService = require('../../__mocks__/issueService');

describe('tests deleteSegmentIssue method', () => {
  it('should throw a 400 error', async () => {
    const mockedSegmentService = segmentService({ getSegmentByIssueId: () => ({ rows: [] }) });
    const mockedProjectService = projectService();
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      params: {
        errorId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.deleteSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should throw a 403 error', async () => {
    const mockedSegmentService = segmentService({ getSegmentByIssueId: () => ({ rows: [{ project_id: 10 }] }) });
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 11 }] })) });
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      params: {
        errorId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.deleteSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('should call deleteSegmentIssueById with errorId', async () => {
    const mockedSegmentService = segmentService({ getSegmentByIssueId: () => ({ rows: [{ project_id: 10 }] }) });
    const mockedProjectService = projectService({ getProjectsByUserId: jest.fn(() => ({ rows: [{ project_id: 10 }] })) });
    const mockedIssueService = issueService();

    const segmentController = new SegmentController(
      mockedSegmentService,
      mockedProjectService,
      mockedIssueService,
    );

    const req = request({
      params: {
        errorId: 10,
      },
      role: 'user',
    });

    const res = response();
    jest.spyOn(res, 'status');
    await segmentController.deleteSegmentIssue(req, res);

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(204);

    expect(mockedIssueService.deleteSegmentIssueById).toHaveBeenCalledTimes(1);
    expect(mockedIssueService.deleteSegmentIssueById).toHaveBeenCalledWith(req.params.issueId);
  });
});
