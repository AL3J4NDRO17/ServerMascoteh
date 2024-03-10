import React from 'react';
import '../styles/registro.css';
import Axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import md5 from 'md5';

const noti = withReactContent(Swal);


export const Registro = () => {

    const navigation = useNavigate();
    const [nombre, setNombre] = useState("");
    const [apePa, setapePa] = useState("");
    const [apeMa, setapeMa] = useState("");
    const [email, setEmail] = useState("");
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");


    const hashedPassword = md5(pass);


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Función para verificar si el correo electrónico es válido
    const isValidEmail = (email) => {
        return emailRegex.test(email);
    };
    

    const nameRegex = /^[A-Za-z\s]+$/;

    const add = (event) => {
        event.preventDefault();
        if (!nombre || !apePa || !apeMa || !user || !email || !pass || !confirmPass) {
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'Por favor completa todos los campos.',
                timer: 3000
            });
        }
        else if (!nameRegex.test(nombre) || !nameRegex.test(apePa) || !nameRegex.test(apeMa)) {
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'El nombre y los apellidos no deben contener números.',
                timer: 3000
            });
        } else if (!isValidEmail(email)) {
            
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'Por favor ingresa un correo electrónico válido.',
                timer: 3000
            });
        }
         else if (pass !== confirmPass) {
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'Las contraseñas no coinciden.',
                timer: 3000
            });
        }
         else if (pass.length < 8) {
            Swal.fire({
                icon: 'error',
                title: 'Error de registro',
                text: 'La contraseña debe tener al menos 8 caracteres.',
                timer: 3000
            });
        } else {
            Axios.post("https://servermascoteh.onrender.com/Insert", {
                nombre: nombre,
                apePa: apePa,
                apeMa: apeMa,
                user: user,
                email: email,
                pass: hashedPassword
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: `Registro Exitoso`,
                    text: `Bienvenido ${user}`,
                    timer: 3000
                }).then(() => {
                    navigation("/InicioSesion");
                });
            }).catch(error => {
                if (error.response && error.response.status === 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de registro',
                        text: 'Usuario ya Registrado',
                        timer: 3000
                    });
                } else {
                    console.error("Error:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de registro',
                        text: 'Usuario ya Registrado',
                        timer: 3000
                    });
                }
            });
        }
    };
    return (
        <section
            className="u-align-center u-clearfix u-gradient u-section-signup"
            id="carousel_c4a6"
        >
            <div className="u-clearfix u-sheet u-sheet-1">
                <h2 className="u-custom-font u-text u-text-default u-text-1">
                    Masco-Registro{" "}
                </h2>
                <div className="u-align-center u-container-style u-expanded-width-sm u-expanded-width-xs u-group u-radius-30 u-shape-round u-white u-group-1">
                    <div className="u-container-layout u-container-layout-1">
                        <div className="custom-expanded u-form u-form-1">
                            <form

                                className="u-clearfix u-form-spacing-15 u-form-vertical u-inner-form"
                                source="email"
                                name="form"
                                style={{ padding: 0 }}
                            >
                                <div className="u-form-group u-form-name">
                                    <label htmlFor="name-4c18" className="u-label u-label-1">
                                        Nombre
                                    </label>
                                    <input
                                        required
                                        value={nombre} onChange={(event) => {
                                            setNombre(event.target.value);
                                        }}
                                        type="text"
                                        placeholder="Ingresa tu Nombre Completo"
                                        id="name-4c18"
                                        name="name"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"

                                    />
                                </div>
                                <div className="u-form-group u-form-group-signup">
                                    <label htmlFor="text-b7b1" className="u-label u-label-signup">
                                        Apellido Paterno
                                    </label>
                                    <input
                                        required
                                        value={apePa}
                                        onChange={(event) => {
                                            setapePa(event.target.value);
                                        }}
                                        type="text"
                                        placeholder="Ingresa tu Apellido Paterno"
                                        id="text-b7b1"
                                        name="text"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"
                                    />
                                </div>
                                <div className="u-form-group u-form-group-3">
                                    <label htmlFor="text-078a" className="u-label u-label-3">
                                        Apellido Materno
                                    </label>
                                    <input
                                        required
                                        value={apeMa}
                                        onChange={(event) => {
                                            setapeMa(event.target.value);
                                        }}
                                        type="text"
                                        placeholder="Ingresa tu Apellido Materno"
                                        id="text-078a"
                                        name="text-1"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"
                                    />
                                </div>
                                <div className="u-form-group u-form-group-3">
                                    <label htmlFor="text-078a" className="u-label u-label-3">
                                        Usuario
                                    </label>
                                    <input
                                        required
                                        value={user}
                                        onChange={(event) => {
                                            setUser(event.target.value);
                                        }}
                                        type="text"
                                        placeholder="Ingrese su nombre de Usuario"
                                        id="text-078a"
                                        name="text-1"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"
                                    />
                                </div>
                                <div className="u-form-email u-form-group">
                                    <label htmlFor="email-4c18" className="u-label u-label-4">
                                        Correo Electronico
                                    </label>
                                    <input

                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                        }}

                                        type="email"
                                        placeholder="Ingrese su Correo Electronico"
                                        id="email-4c18"
                                        name="email"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"
                                        required
                                    />

                                </div>
                                <div className="u-form-group u-form-group-5">
                                    <label htmlFor="text-5847" className="u-label u-label-5">
                                        Contraseña
                                    </label>
                                    <input
                                        value={pass}
                                        onChange={(event) => {
                                            setPass(event.target.value);
                                        }}
                                        type="password"
                                        placeholder="Ingrese su Contraseña"
                                        id="text-5847"
                                        name="text-signup"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"
                                    />
                                </div>
                                <div className="u-form-group u-form-group-6">
                                    <label htmlFor="text-signup38e" className="u-label u-label-6">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        onChange={(e) => setConfirmPass(e.target.value)}
                                        type="password"
                                        id="text-signup38e"
                                        name="text-3"
                                        className="u-border-signup u-border-white u-input u-input-rectangle u-radius-10"
                                        placeholder="Ingrese su Contraseña Nuevamente"
                                    />
                                </div>
                                <div className="u-align-right u-form-group u-form-submit">
                                    <button

                                        onClick={(event) => add(event)}
                                        className="u-active-custom-color-4 u-border-none u-btn u-btn-round u-btn-submit u-button-style u-custom-color-2 u-hover-custom-color-3 u-radius-50 u-text-active-black u-text-hover-black    u-btn-1"

                                    >
                                        Registrarse
                                    </button>
                                    <input
                                        type="submit"
                                        defaultValue="submit"
                                        className="u-form-control-hidden"
                                    />
                                </div>

                                <input type="hidden" defaultValue="" name="recaptchaResponse" />
                                <input
                                    type="hidden"
                                    name="formServices"
                                    defaultValue="dbab78bc-ebc6-f575-e7de-51319149f763"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>



    );
}

export default Registro;

