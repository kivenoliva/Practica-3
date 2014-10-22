/*

  En el anterior prototipo (06-player), el objeto Game permite
  gestionar una colecci�n de tableros (boards). Los tres campos de
  estrellas, la pantalla de inicio, y el sprite de la nave del
  jugador, se a�aden como tableros independientes para que Game pueda
  ejecutar sus m�todos step() y draw() peri�dicamente desde su m�todo
  loop(). Sin embargo los objetos que muestran los tableros no pueden
  interaccionar entre s�. Aunque se a�adiesen nuevos tableros para los
  misiles y para los enemigos, resulta dif�cil con esta arquitectura
  pensar en c�mo podr�a por ejemplo detectarse la colisi�n de una nave
  enemiga con la nave del jugador, o c�mo podr�a detectarse si un
  misil disparado por la nave del usuario ha colisionado con una nave
  enemiga.


  Requisitos:

  Este es precisamente el requisito que se ha identificado para este
  prototipo: dise�ar e implementar un mecanismo que permita gestionar
  la interacci�n entre los elementos del juego. Para ello se dise�ar�
  la clase GameBoard. Piensa en esta clase como un tablero de un juego
  de mesa, sobre el que se disponen los elementos del juego (fichas,
  cartas, etc.). En Alien Invasion los elementos del juego ser�n las
  naves enemigas, la nave del jugador y los misiles. Para el objeto
  Game, GameBoard ser� un board m�s, por lo que deber� ofrecer los
  m�todos step() y draw(), siendo responsable de mostrar todos los
  objetos que contenga cuando Game llame a estos m�todos.

  Este prototipo no a�ade funcionalidad nueva a la que ofrec�a el
  prototipo 06.


  Especificaci�n: GameBoard debe

  - mantener una colecci�n a la que se pueden a�adir y de la que se
    pueden eliminar sprites como nave enemiga, misil, nave del
    jugador, explosi�n, etc.

  - interacci�n con Game: cuando Game llame a los m�todos step() y
    draw() de un GameBoard que haya sido a�adido como un board a Game,
    GameBoard debe ocuparse de que se ejecuten los m�todos step() y
    draw() de todos los objetos que contenga

  - debe ofrecer la posibilidad de detectar la colisi�n entre
    objetos. Un objeto sprite almacenado en GameBoard debe poder
    detectar si ha colisionado con otro objeto del mismo
    GameBoard. Los misiles disparados por la nave del jugador deber�n
    poder detectar gracias a esta funcionalidad ofrecida por GameBoard
    cu�ndo han colisionado con una nave enemiga; una nave enemiga debe
    poder detectar si ha colisionado con la nave del jugador; un misil
    disparado por la nave enemiga debe poder detectar si ha
    colisionado con la nave del jugador. Para ello es necesario que se
    pueda identificar de qu� tipo es cada objeto sprite almacenado en
    el tablero de juegos, pues cada objeto s�lo quiere comprobar si ha
    colisionado con objetos de cierto tipo, no con todos los objetos.

*/




describe("Clase GameBoard", function(){

    var canvas, ctx;

    beforeEach(function(){
	loadFixtures('index.html');

	canvas = $('#game')[0];
	expect(canvas).toExist();

	ctx = canvas.getContext('2d');
	expect(ctx).toBeDefined();
	
	oldGame = Game;
	
	SpriteSheet.load (sprites,function(){});
	board = new GameBoard();            //inicializo un new GameBoard() y ahora mi tablero esta en board todo el rato.
    });

    afterEach(function(){
	Game = oldGame;
    }); 

    it ("add", function(){
         
        board.add(1);
        expect(board.objects[0]).toEqual(1);
    });

    it ("remove", function(){
        
        board.removed = [];
        board.remove(1);
        expect(board.removed[0]).toEqual(1);
    });
    
    
    it ("resetRemoved", function(){
        
       board.removed = [];
       board.remove(1);
       board.remove(2);
       board.remove(3);
       expect(board.removed.length).toEqual(3);
       board.resetRemoved();
       expect(board.removed.length).toEqual(0);
    });
    
    it ("finalizeRemoved", function(){
        //Meto 2 objetos en objects, uno de esos objetos lo meto tambien en removed (estar en removed es estar marcado ese objeto para luego ser
        //borrado. luego llamo a finalizeRemoved y el array de removed deberia estar vacio, y el de objects solo deberia tener el primero.
        
        board.removed = [];
        board.add(1);
        board.add(2);
        board.add(3);
        
        board.remove(board.objects[0]);       // Le meto el numero 1
        board.finalizeRemoved();
        expect(board.objects[0]).toEqual(2);  // EL primer objeto que tenga objects debe ser un 2 porque el uno lo ha tenido que borrar
    });
    
    it ("iterate", function(){
            
        var dummie = {
	        draw: function (){}
	    };
	    
	    spyOn(dummie, "draw");
	    
	    board.add(dummie);
	    
	    board.iterate('draw',ctx);
	   
	    expect(dummie.draw).toHaveBeenCalled();
        	       
    });
    
    it ("draw", function(){
        
        spyOn(board, "iterate");// si draw funciona bien, debe llamar a la funcion iterate de GameBoard.Y esta a su vez llama a draw de cada objeto
                                //como hemos comprobado en el it anterior        
        board.draw(ctx);
               
        expect(board.iterate).toHaveBeenCalled();
        
    });
    
    it ("step", function(){
    
        spyOn(board, "iterate");        
        board.step(ctx);               
        expect(board.iterate).toHaveBeenCalled();
        
        spyOn(board, "resetRemoved");        
        board.step(ctx);               
        expect(board.resetRemoved).toHaveBeenCalled();
        
        spyOn(board, "finalizeRemoved");        
        board.step(ctx);               
        expect(board.finalizeRemoved).toHaveBeenCalled();
                        
    });
    
    it ("overlap acertando", function(){
    
        Game = {width: 320, height: 480};

	    var miNave = new PlayerShip();
	    var miNaveDos = new PlayerShip();
	    
	    expect(board.overlap(miNave, miNaveDos)).toBe(true);

    });
    
    it ("overlap fallando", function(){
    
        Game = {width: 320, height: 480};

	    var miNave = new PlayerShip();
	    
	    Game = {width: 820, height: 980};
	    var miNaveDos = new PlayerShip();
	    
	    expect(board.overlap(miNave, miNaveDos)).toBe(false);

    });
    
    /*
    it ("collide + step", function(){
        
        Game = {width: 320, height: 480};
	    var miNave_Uno = new PlayerShip();
	    
	    Game = {width: 320, height: 480};
	    var miNave_Dos = new PlayerShip();
	    
	    Game = {width: 820, height: 980};
	    var miNave_Tres = new PlayerShip();
	    
	    board.add(miNave_Uno);
	    board.add(miNave_Dos);
	    board.add(miNave_Tres);
	    
	    expect(board.collide(miNave_Uno).toEqual(miNave_Dos));
    
    });
    
    */
        
});


