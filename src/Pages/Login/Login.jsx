import React, { useState } from 'react'
import './Login.css'
import { BiShow, BiSolidHide } from 'react-icons/bi'
import { useFormik } from 'formik'
import validationSchema from '../../schemas/FormValidation'
import { useNavigate } from 'react-router-dom'

const initialValues = {
  username: '',
  email: '',
  phone: '',
  password: '',
  re_password: '',
  id:Date.now().toString()
}

export default function Login() {
  const [show, setShow] = useState(false)
  const [showRePassword, setShowRePassword] = useState(false)
  const navigate = useNavigate()

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    touched,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, action) => {
      console.log(values);
      action.resetForm()
      navigate('/calendar', { state: values });
    },
  })

  const handleShowPassword = () => {
    setShow(!show)
  }

  const handleShowRePassword = () => {
    setShowRePassword(!showRePassword)
  }

  return (
    <div className="login__page">
      <h2>Sign up </h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        {errors.username && touched.username ? (
          <p className="error">{errors.username}</p>
        ) : null}

        <div>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        {errors.email && touched.email ? (
          <p className="error">{errors.email}</p>
        ) : null}

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
        </div>
        {errors.phone && touched.phone ? (
          <p className="error">{errors.phone}</p>
        ) : null}

        <div>
          <input
            type={!show ? 'password' : 'text'}
            placeholder="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <span onClick={handleShowPassword}>
            {' '}
            {show ? <BiSolidHide size={20} /> : <BiShow size={20} />}{' '}
          </span>
        </div>
        {errors.password && touched.password ? (
          <p className="error">{errors.password}</p>
        ) : null}

        <div>
          <input
            type={!showRePassword ? 'password' : 'text'}
            placeholder="Confirm Password"
            name="re_password"
            value={values.re_password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          <span onClick={handleShowRePassword}>
            {' '}
            {showRePassword ? (
              <BiSolidHide size={20} />
            ) : (
              <BiShow size={20} />
            )}{' '}
          </span>
        </div>
        {errors.re_password && touched.re_password ? (
          <p className="error">{errors.re_password}</p>
        ) : null}

        <button type="submit">Login</button>

      </form>
    </div>
  )
}
