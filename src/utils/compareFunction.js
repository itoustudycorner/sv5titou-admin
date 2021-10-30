import moment from 'moment';

export const compareStringName = (a, b) => {
	if (a.name > b.name) return 1;
	else return -1;
};
export const compareStringTarget = (a, b) => {
	if (a.target >= b.target) return 1;
	else return -1;
};
export const compareStringDate = (a, b) => {
	let aDate = moment(a.date, 'DD-MM-YYYY');
	let bDate = moment(b.date, 'DD-MM-YYYY');
    // console.log(aDate.isAfter(bDate));
	if (aDate > bDate) return 1;
	else return -1;
};
export const compareNumber = (a, b) => {
	a = parseInt(a.numPeople);
	b = parseInt(b.numPeople);

	return a - b;
};
