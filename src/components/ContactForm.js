import React, { useState } from 'react';
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
// import  ReCaptcha from 'react-recaptcha';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { init, sendForm } from 'emailjs-com';

const serviceID = process.env.REACT_APP_SERVICE_ID;
const templateID = process.env.REACT_APP_TAMPLATE_ID;
const userID = process.env.REACT_APP_USER_ID;
const CaptchaKey = process.env.REACT_APP_CAPTCHA_KEY;

init(userID);

export const ContactForm = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [statusMessage, setStatusMessage] = useState("Skontaktuj się ze mną wypełniając formularz!");
    const [contactNumber, setContactNumber] = useState("000000");
    console.log(errors)

    const generateContactNumber = () => {
        const numStr = "000000" + (Math.random() * 1000000 | 0);
        setContactNumber(numStr.substring(numStr.length - 6));
    }

    // const onChange = (value) => {
    //   console.log("Recaptcha Value:",value)
    // }

    const onSubmit = () => {
        const form = document.querySelector('#contact-form');
        const statusMsg = document.querySelector('.status-message');

        generateContactNumber();

        sendForm(serviceID, templateID, 'contact-form')
            .then(r => {
                console.log('SUCCESS!', r.status, r.text)
                form.reset();
                setStatusMessage("Wiadomość wysłana, dziękuję za kontakt!");
                statusMsg.className = 'status-message success';
                setTimeout(() => {
                    statusMsg.className = 'status-message'
                }, 4000)
            }, error => {
                console.log('FAILED...', error)
                setStatusMessage('Błąd wysyłania! Spróbuj ponownie.');
                statusMsg.className = 'status-message fail';
                setTimeout(() => {
                    statusMsg.className = 'status-message'
                }, 6000)
            });

    };

    // const onChange = (value) => {
    //     console.log("Recaptcha Value:", value)
    // }

    const name = watch('name') || "";
    const nameCharsLeft = 30 - name.length;

    const message = watch('message') || "";
    const messageCharsLeft = 500 - message.length;

    return (
        <Form id='contact-form' onSubmit={handleSubmit(onSubmit)} action="?" method="POST">
            <input type='hidden' name='contact_number' value={contactNumber} />
            <p className='status-message'>{statusMessage}</p>
            <Form.Group controlId="formBasicText">
                <Form.Label>Imię</Form.Label>
                {errors.name && !errors.name.type === "required" && (
                    <div role="alert">Imię jest wymagane, uzupełnij poniższe pole<br /></div>
                )}
                {errors.name && errors.name.type === "required" && <div role="alert">Imię jest wymagane, uzupełnij poniższe pole<br /></div>}
                <Form.Control
                    type="text"
                    name='name'
                    placeholder="Imię"
                    maxLength='30'
                    aria-invalid={errors.name ? true : false}
                    ref={register({ required: true })}
                />
                <p className='message-chars-left'>{nameCharsLeft}</p>

            </Form.Group>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                {errors.user_email && errors.user_email.type === "required" && (
                    <div role="alert">Email jest wymagany, uzupełnij poniższe pole<br /></div>
                )}
                <Form.Control
                    type="email"
                    name='user_email'
                    placeholder="Adres email"
                    maxLength='30'
                    aria-invalid={errors.user_email ? true : false}
                    ref={register({ required: true })}
                />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Wiadomość</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name='message'
                    placeholder='Widomość'
                    ref={register()}
                    maxLength='500'
                />
                <p className='message-chars-left'>{messageCharsLeft}</p>
            </Form.Group>
            {/* <ReCaptcha onVerifyCaptcha={onVerifyCaptcha} /> */}
            <ReCAPTCHA
                sitekey={CaptchaKey}
                // onChange={onChange}
                aria-invalid={errors.name ? true : false}
                ref={register({ required: true })}
                name="recaptcha"
            />
            <Button variant="primary" type="submit" value='Send'>Wyślij</Button>
        </Form>
    )
}