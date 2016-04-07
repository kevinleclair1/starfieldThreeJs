(function(){

    "use strict";
    
    var scene=new THREE.Scene(),
        cssScene = new THREE.Scene(),
        light= new THREE.AmbientLight(0x404040),
        renderer2,
        raycaster = new THREE.Raycaster(),
        camera,
        renderer = new THREE.WebGLRenderer({alpha: true}),
        box,
        lensFlareTex = THREE.ImageUtils.loadTexture( "../lensflare0.png" ),
        particleTex = THREE.ImageUtils.loadTexture('../particle.png'),
        degrees = 0,
        childBox,
        manager,
        mesh,
        meshArr = [],
        otherDegrees = 0,
        initPos = {
            x: 0,
            y: 0,
            z: 100
        },  
        ground,
        controls=null;

        function initScene(){
          window.scene = scene;

          renderer.setClearColor(0x000000);
            renderer.setSize( window.innerWidth, window.innerHeight );


            document.getElementById("webgl-container").appendChild(renderer.domElement);
            document.body.removeChild(document.getElementById('loader'));
            scene.add(light);

            renderer2 = new THREE.CSS3DRenderer();
            renderer2.setSize(window.innerWidth, window.innerHeight);
            renderer2.domElement.style.position = 'absolute';
            renderer2.domElement.style.top = 0;
            document.body.appendChild(renderer2.domElement);
                      
            camera = new THREE.PerspectiveCamera(
                    35,
                    window.innerWidth / window.innerHeight,
                    1,
                    100000
                );
            
            
            
            scene.add(camera); 

            controls = new THREE.OrbitControls( camera);
            //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
            controls.enableDamping = true;
            controls.dampingFactor = 0.25;
            controls.enableZoom = false; 
            controls.maxDistance = 19000;
            camera.position.set( initPos.x, initPos.y, initPos.z );

            var colourArr = getStarColours();

            colourArr.forEach(function(colour){

              var starColor = Number('0x' + Number(colour).toString(16));
              var stars = star_init_list.filter(function(star){
                return star.color.toString() === colour
              });


              stars.forEach(function(star){

                var pos = {
                  x : star.galX * 30,
                  y: star.galY * 30,
                  z: star.galZ * 30
                }

                // var flare = makeFlare(starColor, star.dist || 1);
                // flare.position.set(pos.x, pos.y, pos.z);
                // scene.add(flare);                  

                var element = document.createElement('p');
                element.style.color = 'white';
                element.innerHTML = star.starName;

                var div = new THREE.CSS3DObject(element);
                div.position.x = pos.x;
                div.position.y = pos.y + 10;
                div.position.z = pos.z;
                cssScene.add(div);

                var geo = new THREE.Geometry();
                var material = new THREE.PointsMaterial( {
                  color: starColor,
                  size: star.dist * 5 || 10,
                  map: particleTex,
                  blending: THREE.AdditiveBlending,
                  transparent: true
                });
                geo.vertices.push(new THREE.Vector3(pos.x, pos.y , pos.z ));
                scene.add( new THREE.Points(geo, material) );
              });
            })

            var skyMat = new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('../galaxy_starfield.png')
            });

            skyMat.side = THREE.BackSide;

            var sphere = new THREE.Mesh(
              new THREE.SphereGeometry(20000, 64, 64),
              skyMat
            );
            scene.add(sphere)

            requestAnimationFrame(render);
        };

        function render() {
                controls.update(); 
                renderer2.render(cssScene, camera);
                renderer.render(scene, camera); 
                requestAnimationFrame(render);
        };

        function getStarColours(){
          var tempObj = {};

          star_init_list.forEach(function(star){
            tempObj[star.color] = 'temp';
          })

          return Object.keys(tempObj);
        }
       
        function makePoint(star, mat){
          var geo = new THREE.SphereGeometry(5, 32, 32);
          var starGeo = new THREE.Mesh(geo, mat);

          starGeo.position.x = star.galX * 1000;
          starGeo.position.y = star.galY * 1000;
          starGeo.position.z = star.galZ * 1000;
          starGeo.scale.set(0.5,0.5,0.5);

          return starGeo;
        }

        function makeFlare(colour, size){
          var flareColour = new THREE.Color(colour);
          return new THREE.LensFlare(
            lensFlareTex,
            size,
            0,
            THREE.AdditiveBlending,
            flareColour
          );
        }

        window.onload = initScene;

})();
