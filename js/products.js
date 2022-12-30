import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { Toast } from './helper.js';
import { apiUrl, apiPath } from './config.js';

const app = createApp({
  data() {
    return {
      products: [],
      tempProduct: {},
      isLoading: false,
    };
  },
  mounted() {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    axios.defaults.headers.common.Authorization = token;
    this.checkAdmin();
  },
  methods: {
    checkAdmin() {
      axios
        .post(`${apiUrl}/api/user/check`)
        .then((_res) => {
          this.getProducts();
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
          window.location = 'login.html';
        });
    },
    getProducts() {
      axios
        .get(`${apiUrl}/api/${apiPath}/admin/products`)
        .then((res) => {
          this.products = res.data.products;
          this.isLoading = true;
        })
        .catch((err) => {
          const errMessage = err.response
            ? err.response.data.message
            : err.data?.message;
          this.isLoading = true;
          Toast.fire({
            title: `${errMessage}`,
            icon: 'error',
          });
        });
    },
    openProduct(product) {
      this.tempProduct = product;
    },
    closeProduct() {
      this.tempProduct = {};
    },
  },
});
// app.component...
app.mount('#app');
