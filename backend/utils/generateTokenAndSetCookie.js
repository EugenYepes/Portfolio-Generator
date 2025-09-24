import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (res, userId) => {
/*
* Usa jwt.sign() para crear un token que contenga un payload (datos) con el userId.
* El secreto (JWT_SECRET) se usa para firmar el token y asegurar que solo el servidor pueda verificar su autenticidad.
* expiresIn: '7d' define que el token será válido por 7 días. --> Después de ese tiempo, el token expirará y el usuario tendrá que volver a iniciar sesión.
*/
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    })

/*
* `res.cookie("authToken", token, { ... })`: Esta línea coloca el token generado en una cookie llamada authToken en la respuesta HTTP
*   - `httpOnly` Configura la cookie para que solo sea accesible desde el servidor y no desde el código JavaScript del navegador
*   - `secure` La cookie solo se enviará a través de conexiones HTTPS si la aplicación está en modo producción
*   - `sameSite` Ayuda a proteger contra ataques CSRF (Cross-Site Request Forgery) al permitir que la cookie se envíe solo si la solicitud proviene del mismo sitio.
*   - `maxAge` Define el tiempo de vida de la cookie en milisegundos (7 días).
*/
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return token;
}

export default generateTokenAndSetCookie;