# practica-mateo-2024

## efectos disponibles en lateralImageEditor

imagen original

![blendColors-2024-09-23-18-07](https://github.com/user-attachments/assets/220f08c0-a838-4de9-9175-94417a8e15b7)

efectos a continuación:

con el efecto de Blend Colors, podemos mezclar dos colores a nuestro antojo, en este caso, tenemos una mezcla entre verde y azul
![blendColors-2024-09-23-18-08](https://github.com/user-attachments/assets/d4f6db97-5e20-4366-be99-fd0e4ba7e3a4)

con el efecto de halftone, podemos transformar la imagen en sólo puntos, en este caso tenemos dos parámetros, una imagen que se renderiza a partir de círculos, y la otra a partir de cuadrados
![halftonePruebas-2024-09-23-18-08](https://github.com/user-attachments/assets/d0444c51-eecc-4d6f-b055-ab45023293c1)
![halftonePruebas-2024-09-23-18-08 (1)](https://github.com/user-attachments/assets/21f4bd3a-45c7-472c-8578-ff7322f85ddd)

con el efecto de pixelado podemos pixelar la imagen y cambiar los colores oscuros y claros de la imagen, además de cambiar la densidad de pixeles de la imagen. También tenemos la opción de un pixelado común bien vintage 
![pixelHalftone-2024-09-23-18-11](https://github.com/user-attachments/assets/e705e3c6-c6e4-40c3-a573-55021a74058c)
![pixelHalftone-2024-09-23-18-12](https://github.com/user-attachments/assets/76e6b6b1-765f-4623-8c3f-2cc0152edde3)
![pixelado-2024-09-23-18-21](https://github.com/user-attachments/assets/6162d8bc-dec1-45b4-bef1-425b3eec2109)

con el efecto threshold, podemos aplicar el efecto drástico de cambiar luces y sombras, a blancos y negros. Podemos cambiar el nivel del efecto a tu antojo
![threshold-2024-09-23-18-12](https://github.com/user-attachments/assets/58244af5-38f6-4753-ab24-ebb252afe63d)
![threshold-2024-09-23-18-13](https://github.com/user-attachments/assets/bda25574-e39b-43d6-bce3-d7988685b27f)


## manual para terminal

```zsh
# listar - muestra lo que hay en el directorio
ls
```

```zsh
# directorio donde estoy - ruta del archivo
pwd 
```

```zsh
# change directory - ir a carpeta X
cd X
```

```zsh
#  ir una carpeta atrás
cd ..
```

```zsh
# imprimir historial
history
```

```zsh
# abrir finder donde te encuentras
open . 
```

```zsh
- incluir archivo X
git add X
```

```zsh
- incluir todos los cambios en el directorio actual
git add .
```

```zsh
# hacer un commit en mi máquina con un mensaje
git commit -m "MENSAJE"
```

```zsh
# subir los cambios a la nube
git push 
```

```zsh
# incorporar a mi máquina los cambios desde la nube
git pull 
```

```zsh
# deshacer cambios en el directorio de trabajo
git stash
```

## instrucciones para lanzar el proyecto desde terminal

```zsh
# ir al directorio del proyecto
cd my-project
```

```zsh
# instalar node_modules
npm install
```

```zsh
# correr el proyecto
npm run dev
```

## actualización de objetivos primarios

- escribir y documentar un software / herramienta para automatizar ediciones de material gráfico
- efectos a lograr: duotone, halftone, semitone.
