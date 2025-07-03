#!/usr/bin/env python3
"""
Script para popular o banco de dados com dados iniciais
"""
import os
import sys

# Adicionar o diretório do projeto ao path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.main import app
from src.models.user import db
from src.models.presentation import SystemLink

def setup_initial_data():
    """Configura dados iniciais no banco de dados"""
    with app.app_context():
        # Criar tabelas se não existirem
        db.create_all()
        
        # Verificar se já existem dados
        existing_links = SystemLink.query.count()
        if existing_links > 0:
            print(f"Já existem {existing_links} links cadastrados. Pulando inserção inicial.")
            return
        
        # Dados iniciais dos sistemas
        initial_systems = [
            {
                'name': 'DSS Dashboard - Painel de Agentes',
                'url': 'https://dss21.redeservice.com.br/DSS/Dashboard/PainelAgentes.aspx',
                'duration': 45,
                'order_index': 1
            },
            {
                'name': 'Sistema de Atendimento - Dashboard',
                'url': 'https://atendimento.redeservice.com.br/v2/admin/dashboard_cliente_sem_resposta_lista.aspx',
                'duration': 45,
                'order_index': 2
            }
        ]
        
        # Inserir sistemas
        for system_data in initial_systems:
            system = SystemLink(**system_data)
            db.session.add(system)
        
        # Salvar no banco
        db.session.commit()
        
        print(f"✅ Dados iniciais inseridos com sucesso!")
        print(f"   - {len(initial_systems)} sistemas cadastrados")
        
        # Listar sistemas cadastrados
        print("\n📋 Sistemas cadastrados:")
        for system in SystemLink.query.all():
            print(f"   • {system.name}")
            print(f"     URL: {system.url}")
            print(f"     Duração: {system.duration}s")
            print()

if __name__ == '__main__':
    setup_initial_data()

