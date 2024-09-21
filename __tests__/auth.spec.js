import User from "../DB/models/user.model.js";
import { login, register } from "../src/modules/auth/auth.controller.js";
jest.mock("../DB/models/user.model.js");

describe("register controller", () => {
  let mockReq, mockRes, mockNext;
  beforeEach(() => {
    mockReq = { body: { email: "test@foo.com", password: "bar" } };
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if a duplicated email tries to register", async () => {
    // Arrange
    jest.spyOn(User, "create").mockRejectedValueOnce(new Error());
    // Act
    try {
      await register(mockReq, mockRes, mockNext);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it("should call res.json and call res.status with 201 if user is created", async () => {
    // Arrange
    jest.spyOn(User, "create").mockImplementationOnce((userData) => {
      return {
        email: userData.email,
        password: userData.password + "hashed",
      };
    });
    // Act
    await register(mockReq, mockRes, mockNext);
    // Assert
    expect(mockNext).not.toHaveBeenCalled();
    expect(User.create).toHaveBeenCalledTimes(1);
    expect(User.create).toHaveBeenCalledWith(mockReq.body);
    expect(User.create).toHaveReturnedWith({
      email: mockReq.body.email,
      password: mockReq.body.password + "hashed",
    });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
    });
  });
});

describe("login controller", () => {
  let mockReq, mockRes, mockNext, dummyUser;
  beforeEach(() => {
    mockReq = { body: { email: "test@foo.com", password: "bar" } };
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    dummyUser = {
      checkPassword: jest.fn(() => true),
      generateToken: jest.fn(() => "token"),
    };
  });

  it("should call next if user not found", async () => {
    // Arrange
    jest.spyOn(User, "findOne").mockResolvedValueOnce(null);
    // Act
    await login(mockReq, mockRes, mockNext);
    // Assert
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid Email!"));
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it("should call next if password doesn't match", async () => {
    // Arrange
    dummyUser.checkPassword.mockReturnValueOnce(false);
    jest.spyOn(User, "findOne").mockResolvedValue(dummyUser);
    // Act
    await login(mockReq, mockRes, mockNext);
    // Assert
    expect(mockNext).toHaveBeenCalledWith(new Error("Invalid Password!"));
    expect(dummyUser.generateToken).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
  });

  it("should call res.json with the token and call res.status with 200 if everything is ok", async () => {
    // Arrange
    jest.spyOn(User, "findOne").mockResolvedValue(dummyUser);
    // Act
    await login(mockReq, mockRes, mockNext);
    // Assert
    expect(mockNext).not.toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ email: mockReq.body.email });

    expect(dummyUser.checkPassword).toHaveBeenCalledWith(mockReq.body.password);
    expect(dummyUser.generateToken).toHaveBeenCalled();

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      results: { token: "token" },
    });
  });
});
