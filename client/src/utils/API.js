import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, ADD_USER, LOGIN_USER, SAVE_BOOK, REMOVE_BOOK } from './queries';

export const getMe = () => {
  return useQuery(GET_ME);
};

export const createUser = (userData) => {
  return useMutation(ADD_USER, {
    variables: userData,
  });
};

export const loginUser = (userData) => {
  return useMutation(LOGIN_USER, {
    variables: userData,
  });
};

export const saveBook = (bookData, token) => {
  return useMutation(SAVE_BOOK, {
    variables: { bookData },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
};

export const deleteBook = (bookId, token) => {
  return useMutation(REMOVE_BOOK, {
    variables: { bookId },
    context: {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  });
};

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
