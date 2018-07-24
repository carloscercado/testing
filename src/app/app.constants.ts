export const CONSTANTS = {
  BACK_URL: 'https://bigwave-api.herokuapp.com/v1'
}

export const Search = {
  query: ''
}

export const API_ROUTES = {
  login(email, pass) {
    return `${CONSTANTS.BACK_URL}/auth/sign_in?email=${email}&password=${pass}`;
  },
  registerUser() {
    return `${CONSTANTS.BACK_URL}/auth`;
  },
  forgotPasswordStepOne() {
    return `${CONSTANTS.BACK_URL}/forgot-password-step-one`;
  },
  updateUser() {
    return `auth`;
  },
  getCategories() {
    return `profiles/categories`;
  },
  getSubcategories() {
    return `products/:profile_id/subcategories/enabled`;
  },
  currentUser() {
    return `users/current`;
  },
  createPyme() {
    return `pymes/create`;
  },
  getPymes() {
    return `pymes`;
  },
  getMyPymes() {
    return `pymes/own`;
  },
  deletePyme() {
    return `pymes/:pyme_id/destroy`;
  },
  updatePyme() {
    return `pymes/:pyme_id/update`;
  },
  getAPyme() {
    return `pymes/:profile_id`;
  },
  getPymeProducts() {
    return `pymes/:profile_id/products`;
  },
  createProductsPyme() {
    return `:type_profile/:id_profile/products`;
  },
  deletePymesProducts() {
    return `pymes/:profile_id/products/:product_id/destroy`;
  },
  createSeller() {
    return `sellers/create`;
  },
  getSellers() {
    return `sellers`;
  },
  getMySellers() {
    return `sellers/own`;
  },
  deleteSeller() {
    return `sellers/:seller_id/destroy`;
  },
  updateSeller() {
    return `sellers/:seller_id/update`;
  },
  getASeller() {
    return `sellers/:profile_id`;
  },
  getSellerProducts() {
    return `seller/:profile_id/products`;
  },
  createProductsSeller() {
    return `:type_profile/:id_profile/products`;
  },
  deleteSellersProducts() {
    return `sellers/:profile_id/products/:product_id/destroy`;
  },
  createIndependent() {
    return `independent/create`;
  },
  getIndependents() {
    return `independents`;
  },
  getMyIndependents() {
    return `independents/own`;
  },
  deleteIndependent() {
    return `independents/:independent_id/destroy`;
  },
  updateIndependent() {
    return `independents/:independent_id/update`;
  },
  getAIndependent() {
    return `independents/:profile_id`;
  },
  getIndependentProducts() {
    return `independent/:profile_id/products`;
  },
  createProductsIndependent() {
    return `:type_profile/:id_profile/products`;
  },
  deleteIndependentsProducts() {
    return `independents/:profile_id/products/:product_id/destroy`;
  },
  searchs(q) {
    return `/searchs?q=${q}`;
  },
  createRange() {
    return `:type_profile/:profile_id/products/:product_id/price_ranges`;
  },
  getProduct() {
    return `:type_profile/:profile_id/products/:product_id`;
  },
  updateProduct() {
    return `:type_profile/:profile_id/products/:product_id/update`;
  },
  deletePriceRange() {
    return `:type_profile/:profile_id/products/:product_id/price_ranges/:price_range_id/destroy`;
  },
  productCreateOptions() {
    return `:type_profile/:profile_id/products/:product_id/options`;
  },
  productCreateCustomFields() {
    return `:type_profile/:profile_id/products/:product_id/custom_fields`;
  },
  productDeleteCustomFields() {
    return `:type_profile/:profile_id/products/:product_id/custom_fields/:custom_field_id/destroy`;
  },
  productDeleteOptions() {
    return `:type_profile/:profile_id/products/:product_id/options/:option_id/destroy`;
  },
  followProfile() {
    return `current_user/follow/:type_profile/:profile_id`;
  },
  unfollowProfile() {
    return `current_user/unfollow/:type_profile/:profile_id`;
  },
  getFollowers() {
    return `current_user/followers/:type_profile/:profile _id`;
  },
  getFollowing() {
    return `current_user/following/:type_profile`;
  },
  createWishes(){
    return 'wishes/create';
  },
  myWishes(){
    return 'wishes/my_wishes';
  },
  deleteWishes(){
    return `wishes/:wish_id/destroy`;
  },
  deleteFile() {
    return `products/:product_id/upload/:file_type/:file_id/delete`;
  }
};
