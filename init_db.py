#!/usr/bin/env python3
"""
Script simples para inicializar o banco de dados
"""
import os
import sys
import sqlite3

def init_database():
    """Inicializa o banco de dados com dados básicos"""
    
    # Caminho do banco de dados
    db_path = os.path.join(os.path.dirname(__file__), 'src', 'database', 'app.db')
    
    # Criar diretório se não existir
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    # Conectar ao banco
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Criar tabelas
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS system_link (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(100) NOT NULL,
            url VARCHAR(500) NOT NULL,
            duration INTEGER NOT NULL DEFAULT 30,
            order_index INTEGER NOT NULL DEFAULT 0,
            active BOOLEAN NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS image (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename VARCHAR(255) NOT NULL,
            original_name VARCHAR(255) NOT NULL,
            order_index INTEGER NOT NULL DEFAULT 0,
            duration INTEGER NOT NULL DEFAULT 10,
            active BOOLEAN NOT NULL DEFAULT 1,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS config (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key VARCHAR(100) NOT NULL UNIQUE,
            value TEXT NOT NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Verificar se já existem sistemas
    cursor.execute('SELECT COUNT(*) FROM system_link')
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Inserir sistemas iniciais
        systems = [
            ('DSS Dashboard - Painel de Agentes', 'https://dss21.redeservice.com.br/DSS/Dashboard/PainelAgentes.aspx', 45, 1),
            ('Sistema de Atendimento - Dashboard', 'https://atendimento.redeservice.com.br/v2/admin/dashboard_cliente_sem_resposta_lista.aspx', 45, 2)
        ]
        
        cursor.executemany('''
            INSERT INTO system_link (name, url, duration, order_index)
            VALUES (?, ?, ?, ?)
        ''', systems)
        
        print(f"✅ {len(systems)} sistemas inseridos com sucesso!")
    else:
        print(f"ℹ️  Banco já possui {count} sistemas cadastrados.")
    
    # Salvar e fechar
    conn.commit()
    conn.close()
    
    print(f"✅ Banco de dados inicializado: {db_path}")

if __name__ == '__main__':
    init_database()

