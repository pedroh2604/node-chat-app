var expect = require('expect');

var {Users} = require('./users');

describe('Users', () => {
	var users;

	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'Pedro',
			room: 'Coding'
		},{
			id: '2',
			name: 'Bea',
			room: 'Learning'
		},{
			id: '3',
			name: 'Mike',
			room: 'Coding'
		}]
	});


	it('should add a new user', () => {
		var users = new Users();
		var user = {
			id: '123',
			name: 'Peter',
			room: 'Programmers'
		};

		var resUser = users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('should remove a user', () => {
		var userId = '1';
		var user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		// the original length was 3, but one user has just been removed
		expect(users.users.length).toBe(2);
	});

	it('should not remove a user', () => {
		var userId = '34';
		var user = users.removeUser(userId);

		expect(user).toNotExist();
		// the original length was 3, but one user has just been removed
		expect(users.users.length).toBe(3);
	});

	it('should find a user', () => {
		var userId = '2';
		var user = users.getUser(userId);

		expect(user.id).toBe(userId);
	});

	it('should not find a user', () => {
		var userId = '87';
		var user = users.getUser(userId);

		expect(user).toNotExist();
	});

	it('should return names for Coding', () => {
		var userList = users.getUserList('Coding');

		expect(userList).toEqual(['Pedro', 'Mike']);
	});

	it('should return names for Learning', () => {
		var userList = users.getUserList('Learning');

		expect(userList).toEqual(['Bea']);
	});
});