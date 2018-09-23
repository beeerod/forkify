import axios from 'axios';


const proxy = 'https://cors-anywhere.herokuapp.com/';
const key = '8108a534a2233540c46c324bc76123f6';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults(query) {

    try {
      const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.result = res.data.recipes;
      this.first = res;
      this.second = res.data;
      console.log(this.first);
      console.log(this.second);
      console.log(this.result);
      console.log(`${query}Query`);
    } catch (error) {
      alert('Big time error homie');
    }
  }
}
