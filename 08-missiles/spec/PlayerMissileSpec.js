/*

  Requisitos: 

  La nave del usuario disparará 2 misiles si está pulsada la tecla de
  espacio y ha pasado el tiempo de recarga del arma.

  El arma tendrá un tiempo de recarga de 0,25s, no pudiéndose enviar
  dos nuevos misiles antes de que pasen 0,25s desde que se enviaron
  los anteriores



  Especificación:

  - Hay que añadir a la variable sprites la especificación del sprite
    missile

  - Cada vez que el usuario presione la tecla de espacio se añadirán
    misiles al tablero de juego en la posición en la que esté la nave
    del usuario. En el código de la clase PlayerSip es donde tienen
    que añadirse los misiles

  - La clase PlayerMissile es la que implementa los misiles. Es
    importante que la creación de los misiles sea poco costosa pues va
    a haber muchos disparos, para lo cual se declararán los métodos de
    la clase en el prototipo

*/

describe("Prueba de funcion PlayerMissile", function(){

    var canvas, ctx;

    beforeEach(function(){
	    loadFixtures('index.html');

	    canvas = $('#game')[0];
	    expect(canvas).toExist();

	    ctx = canvas.getContext('2d');
	    expect(ctx).toBeDefined();
	
	    SpriteSheet.load (sprites,function(){});
	    oldGame = Game;
	   	
    });

    afterEach(function(){
	    Game = oldGame;
    }); 
    
    
    it ("step", function(){
        
        // Pruebo que haga bien el valor de y, debe darme (20), calculado yo a mano
            
    
        misil = new PlayerMissile(10,100);
        
        var dt = 0.1;
        misil.step(dt);
        
        expect(misil.y).toEqual(20);
        
        //Pruebo que ahora this.y < -this.h para que haga llamar a remove.
        misil2 = new PlayerMissile(10,50);
        
        var boarddummie = {     //Game board en el que estaria el misil.
            remove: function (){}
        };
        
        misil2.board = boarddummie;
        
        spyOn(misil2.board, "remove")
        
        misil2.step(dt);
        expect(misil2.board.remove).toHaveBeenCalled();
           
    });
    
    
    it ("draw", function(){
    
        misil = new PlayerMissile(10,100);
        
        SpriteSheet = {
            draw: function(ctx, name, x, y) {},
        }
             
        spyOn(SpriteSheet, "draw");
        misil.draw(ctx)
        expect(SpriteSheet.draw).toHaveBeenCalled();
        expect(SpriteSheet.draw.calls[0].args[0]).toEqual(ctx);
        expect(SpriteSheet.draw.calls[0].args[1]).toEqual("missile");
        expect(SpriteSheet.draw.calls[0].args[2]).toEqual(misil.x);
        expect(SpriteSheet.draw.calls[0].args[3]).toEqual(misil.y);
        
    });
    
    
});
